const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const { getDatabase, UserMemory, WisdomText } = require('../db/database');

// Initialize Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.error("⚠️ GEMINI_API_KEY is not defined in the environment variables!");
}

/**
 * Retrieves all user memories and builds a system prompt context block.
 */
async function injectMemories(userId, baseSystemPrompt) {
  try {
    await getDatabase();
    const memories = await UserMemory.find({ user_id: userId }).sort({ created_at: 1 }).lean();

    if (!memories || memories.length === 0) {
      return baseSystemPrompt;
    }

    const memoryBlock = memories.map(m => `- ${m.memory_text}`).join('\n');
    
    return `${baseSystemPrompt}\n\n[USER PROFILE & MEMORIES]\nHere are details the user has shared in past sessions. Incorporate this knowledge naturally into the conversation to maintain context without explicitly reciting this list:\n${memoryBlock}`;
  } catch (error) {
    console.error('Error injecting memories:', error);
    return baseSystemPrompt;
  }
}

/**
 * Retrieves wisdom texts from the database for a specific book.
 */
async function injectWisdom(bookName, userMessage) {
  try {
    await getDatabase();
    const verses = await WisdomText.find({ book_name: bookName }).limit(20).lean();

    if (!verses || verses.length === 0) return '';

    const wisdomBlock = verses.map(v => `Chapter ${v.chapter}, Verse ${v.verse}: "${v.content}"`).join('\n');
    return `\n\n[SACRED TEXT REFERENCE: ${bookName.toUpperCase()}]\nUse the following passages from the sacred text to guide your response. Quote them accurately when relevant to the user's struggle:\n${wisdomBlock}`;
  } catch (error) {
    console.error('Error injecting wisdom:', error);
    return '';
  }
}

/**
 * Periodically extracts new memories from a conversation exchange using Gemini.
 */
async function consolidateMemory(userId, userMessage, assistantResponse) {
  if (!genAI) return;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `You are a quiet observer. Analyze the user's message and the assistant's reply.
Identify if the user has shared any new, significant personal facts (e.g. name, struggles, values, preferences, profession, life events) that should be remembered for a long-term relationship.
Format each fact as a simple, objective third-person statement starting with "The user...".
Examples:
- "The user's dog recently passed away."
- "The user prefers morning meditation."
- "The user has difficulty sleeping due to job stress."

If no new significant personal facts are shared, output exactly "NONE".
If new facts are shared, output only those facts, one per line. Do not write any conversational intro or explanation.

Exchange:
User: "${userMessage}"
Assistant: "${assistantResponse}"

Output:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (text === "NONE" || text === "" || text.toLowerCase().includes("none")) {
      return;
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.startsWith('The user'));
    
    if (lines.length > 0) {
      await getDatabase();

      for (const line of lines) {
        // Simple duplicate check
        const exists = await UserMemory.findOne({ user_id: userId, memory_text: line }).lean();
        if (!exists) {
          const memoryId = crypto.randomUUID();
          await UserMemory.create({
            id: memoryId,
            user_id: userId,
            memory_text: line,
            category: 'fact',
            created_at: new Date()
          });
          console.log(`[MEMORY CONSOLIDATION] New memory saved for user ${userId}: "${line}"`);
        }
      }
    }
  } catch (error) {
    console.error('Error in consolidateMemory:', error);
  }
}

module.exports = { injectMemories, injectWisdom, consolidateMemory, genAI };
