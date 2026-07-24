const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getDatabase, User, Conversation, Message, UserMemory } = require('./db/database');
const { authMiddleware, optionalAuthMiddleware, JWT_SECRET } = require('./middleware/auth');
const { safetyMiddleware } = require('./middleware/safety');
const { injectMemories, injectWisdom, consolidateMemory, genAI } = require('./services/memoryService');

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Load Personas config from JSON files
const personasDir = path.join(__dirname, 'personas');
const personas = {};

function loadPersonas() {
  try {
    const files = fs.readdirSync(personasDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(personasDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        personas[data.id] = data;
      }
    });
    console.log(`✓ Loaded ${Object.keys(personas).length} personas`);
  } catch (error) {
    console.error('Error loading personas from JSON:', error);
  }
}

// Initial DB and Persona Loading
loadPersonas();

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }

  try {
    await getDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = crypto.randomUUID();

    await User.create({
      id: userId,
      email,
      password_hash: passwordHash,
      username,
      bot_name: 'Companion'
    });

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, bot_name: 'Companion', username } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await getDatabase();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, bot_name: user.bot_name, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    await getDatabase();
    const user = await User.findOne({ id: req.userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      bot_name: user.bot_name || 'Noerax Guide',
      bookmarks: user.bookmarks || [],
      reading_progress: user.reading_progress || {},
      streak_count: user.streak_count || 1,
      last_checkin_date: user.last_checkin_date || '',
      saved_journals: user.saved_journals || [],
      created_at: user.created_at
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// --- User Profile & Ecosystem Endpoints ---

app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    await getDatabase();
    const user = await User.findOne({ id: req.userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      bot_name: user.bot_name || 'Noerax Guide',
      bookmarks: user.bookmarks || [],
      reading_progress: user.reading_progress || {},
      streak_count: user.streak_count || 1,
      last_checkin_date: user.last_checkin_date || '',
      saved_journals: user.saved_journals || [],
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/user/bookmarks', authMiddleware, async (req, res) => {
  const { bookmarks, reading_progress } = req.body;
  try {
    await getDatabase();
    const update = {};
    if (Array.isArray(bookmarks)) update.bookmarks = bookmarks;
    if (reading_progress && typeof reading_progress === 'object') update.reading_progress = reading_progress;

    const user = await User.findOneAndUpdate({ id: req.userId }, { $set: update }, { new: true }).lean();
    res.json({ bookmarks: user.bookmarks, reading_progress: user.reading_progress });
  } catch (error) {
    console.error('Bookmarks update error:', error);
    res.status(500).json({ error: 'Failed to update bookmarks' });
  }
});

app.post('/api/user/streak', authMiddleware, async (req, res) => {
  const { streak_count, last_checkin_date } = req.body;
  try {
    await getDatabase();
    const user = await User.findOneAndUpdate(
      { id: req.userId },
      { $set: { streak_count, last_checkin_date } },
      { new: true }
    ).lean();
    res.json({ streak_count: user.streak_count, last_checkin_date: user.last_checkin_date });
  } catch (error) {
    console.error('Streak update error:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

app.post('/api/user/journals', authMiddleware, async (req, res) => {
  const { id, entry, insights, quote, action_steps, tone } = req.body;
  if (!entry || !insights) {
    return res.status(400).json({ error: 'Entry and insights are required' });
  }

  try {
    await getDatabase();
    const newJournal = {
      id: id || crypto.randomUUID(),
      entry,
      insights,
      quote: quote || '',
      action_steps: action_steps || [],
      tone: tone || 'Reflective',
      created_at: new Date()
    };

    const user = await User.findOneAndUpdate(
      { id: req.userId },
      { $push: { saved_journals: { $each: [newJournal], $position: 0 } } },
      { new: true }
    ).lean();

    res.status(201).json({ saved_journals: user.saved_journals });
  } catch (error) {
    console.error('Journal save error:', error);
    res.status(500).json({ error: 'Failed to save journal reflection' });
  }
});

app.put('/api/auth/bot-name', authMiddleware, async (req, res) => {
  const { bot_name } = req.body;
  if (!bot_name || bot_name.trim() === '') {
    return res.status(400).json({ error: 'Bot name is required' });
  }

  try {
    await getDatabase();
    await User.findOneAndUpdate({ id: req.userId }, { bot_name: bot_name.trim() });
    res.json({ success: true, bot_name: bot_name.trim() });
  } catch (error) {
    console.error('Update bot name error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Persona Routes ---

app.get('/api/personas', (req, res) => {
  const list = Object.values(personas).map(p => ({
    id: p.id,
    name: p.name,
    title: p.title,
    description: p.description,
    avatar_url: p.avatar_url,
    color_accent: p.color_accent,
    few_shots: p.few_shots
  }));
  res.json(list);
});

// --- Conversation & Chat Routes ---

app.get('/api/conversations', optionalAuthMiddleware, async (req, res) => {
  try {
    await getDatabase();
    
    // Fetch all conversations for the user
    const list = await Conversation.find({ user_id: req.userId }).sort({ updated_at: -1 }).lean();
    
    // For each conversation, fetch the last message to enrich the data
    for (let c of list) {
      const lastMsg = await Message.findOne({ conversation_id: c.id }).sort({ created_at: -1 }).lean();
      if (lastMsg) {
        c.last_message_content = lastMsg.content;
        c.last_message_time = lastMsg.created_at;
      }
    }
    
    res.json(list);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/conversations/create', optionalAuthMiddleware, async (req, res) => {
  const { personaId, initialCheckin, botName } = req.body;
  if (!personaId || !personas[personaId]) {
    return res.status(400).json({ error: 'Valid Persona ID is required' });
  }

  try {
    await getDatabase();
    const conversationId = crypto.randomUUID();
    const finalBotName = (botName && botName.trim() !== '') ? botName.trim() : 'Companion';

    const conversation = await Conversation.create({
      id: conversationId,
      user_id: req.userId,
      persona_id: personaId,
      bot_name: finalBotName
    });

    if (initialCheckin && initialCheckin.trim() !== '') {
      const memoryId = crypto.randomUUID();
      await UserMemory.create({
        id: memoryId,
        user_id: req.userId,
        memory_text: `On onboarding, user shared: "${initialCheckin}"`,
        category: 'initial_context'
      });
    }

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/conversations', authMiddleware, async (req, res) => {
  try {
    await getDatabase();
    await Conversation.deleteMany({ user_id: req.userId });
    res.status(204).send();
  } catch (error) {
    console.error('Delete all conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/conversations/:id', authMiddleware, async (req, res) => {
  try {
    await getDatabase();
    const result = await Conversation.deleteOne({ id: req.params.id, user_id: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/conversations/:id', authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    await getDatabase();
    const result = await Conversation.updateOne(
      { id: req.params.id, user_id: req.userId }, 
      { title, updated_at: new Date() }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Rename conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/conversations/:id/bot-name', authMiddleware, async (req, res) => {
  const { bot_name } = req.body;
  if (!bot_name || bot_name.trim() === '') {
    return res.status(400).json({ error: 'Bot name is required' });
  }
  try {
    await getDatabase();
    const result = await Conversation.updateOne(
      { id: req.params.id, user_id: req.userId }, 
      { bot_name: bot_name.trim(), updated_at: new Date() }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized' });
    }
    res.json({ success: true, bot_name: bot_name.trim() });
  } catch (error) {
    console.error('Rename conversation bot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/conversations/:id/messages', optionalAuthMiddleware, async (req, res) => {
  try {
    await getDatabase();
    const conversation = await Conversation.findOne({ id: req.params.id, user_id: req.userId }).lean();
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation_id: req.params.id }).sort({ created_at: 1 }).lean();
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat Message Endpoint
app.post('/api/chat/message', optionalAuthMiddleware, safetyMiddleware, async (req, res) => {
  const { conversationId, message } = req.body;
  if (!conversationId || !message) {
    return res.status(400).json({ error: 'Conversation ID and message are required' });
  }

  try {
    await getDatabase();
    
    // Check ownership of conversation
    const conversation = await Conversation.findOne({ id: conversationId, user_id: req.userId }).lean();
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized' });
    }

    const persona = personas[conversation.persona_id];
    if (!persona) {
      return res.status(404).json({ error: 'Persona associated with this conversation no longer exists' });
    }

    // 1. Save User Message to Database
    const userMsgId = crypto.randomUUID();
    await Message.create({
      id: userMsgId,
      conversation_id: conversationId,
      sender: 'user',
      content: message
    });

    // 2. Fetch recent conversation history
    const history = await Message.find({ conversation_id: conversationId }).sort({ created_at: 1 }).lean();
    const recentHistory = history;

    // Map history to Gemini API format
    let formattedHistory = [];
    let expectedRole = 'user';
    
    for (const m of recentHistory.slice(0, -1)) {
      const role = m.sender === 'user' ? 'user' : 'model';
      if (role === expectedRole) {
        formattedHistory.push({ role, parts: [{ text: m.content }] });
        expectedRole = role === 'user' ? 'model' : 'user';
      }
    }
    
    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
      formattedHistory.pop();
    }

    // 3. Inject user memories into system instructions
    let fullSystemPrompt = await injectMemories(req.userId, persona.system_prompt);

    // Inject Custom Bot Name & Relationship Inference
    const customBotName = conversation.bot_name || 'Companion';
    if (customBotName !== 'Companion') {
      fullSystemPrompt = fullSystemPrompt.replace(/You are the user's best friend/g, `You are ${customBotName}`);
      fullSystemPrompt += `\n\n[CRITICAL RELATIONSHIP DYNAMICS: The user has named you "${customBotName}". 
1. RELATIONSHIP INFERENCE (OVERRIDE DEFAULT): Analyze this name. If the name implies a specific relationship (e.g., a romantic partner, a parent, a mentor, a specific friend, or a sibling), COMPLETELY OVERRIDE your default persona to fit this exact role.
2. ADAPTIVE PERSONA: If the name implies a lover/partner, act deeply romantic and caring. If it implies a parent, act protective and wise. If it implies a specific character, act like them. Adapt your vocabulary (e.g., you can use 'aap' or 'tu' if it fits the specific character/relationship better than 'tum').
3. NATURAL FLOW: Above all, make the conversation feel completely natural and human based on who the user wants you to be.]`;
    }

    // Inject Temporal Awareness for the AI to react to long gaps
    if (history.length >= 2) {
      const lastMsgTime = new Date(history[history.length - 2].created_at);
      const currentTime = new Date();
      const diffMs = currentTime - lastMsgTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 2) { 
         fullSystemPrompt += `\n\n[SYSTEM AWARENESS NOTE: It has been ${Math.floor(diffHours)} hours since you last spoke to the user. Naturally acknowledge this time gap like a real best friend in a casual, warm way (e.g., 'Kahan the yaar itni der?', 'Badi der mein yaad kiya tumne?', or 'Sab theek hai na?'). Do NOT mention the exact hours, just the vibe of 'it's been a while'.]`;
      }
    }

    // Parse multiple Groq keys from environment if available
    let groqKeys = [];
    if (process.env.GROQ_API_KEYS) {
      groqKeys = process.env.GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k.startsWith('gsk_'));
    } else if (process.env.GROQ_API_KEY) {
      groqKeys = [process.env.GROQ_API_KEY.trim()];
    }

    let replyText = '';

    if (groqKeys.length > 0) {
      try {
        const groqMessages = [{ role: 'system', content: fullSystemPrompt }];
        for (const m of recentHistory.slice(0, -1)) {
           groqMessages.push({
             role: m.sender === 'user' ? 'user' : 'assistant',
             content: m.content
           });
        }
        groqMessages.push({ role: 'user', content: message });

        // Shuffle groqKeys to attempt in a random order
        const shuffledKeys = [...groqKeys].sort(() => 0.5 - Math.random());
        let groqSuccess = false;

        for (const selectedGroqKey of shuffledKeys) {
          try {
            const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${selectedGroqKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: groqMessages,
                max_tokens: 500,
                temperature: 0.7
              })
            });

            if (groqResponse.ok) {
              const groqData = await groqResponse.json();
              replyText = groqData.choices[0].message.content;
              groqSuccess = true;
              break; // Success! Exit the loop.
            } else {
               console.warn(`Groq key ${selectedGroqKey.substring(0, 10)}... failed: ${await groqResponse.text()}. Trying next key.`);
            }
          } catch (err) {
             console.warn(`Network error with Groq key ${selectedGroqKey.substring(0, 10)}... Trying next key.`);
          }
        }
        
        if (!groqSuccess) {
           console.error("All Groq keys failed. Falling back to Gemini.");
        }
      } catch (groqError) {
        console.error("Groq integration failed:", groqError);
      }
    }

    if (!replyText && genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          systemInstruction: fullSystemPrompt
        });
        const chatSession = model.startChat({ history: formattedHistory });
        const response = await chatSession.sendMessage(message);
        replyText = response.response.text();
      } catch (geminiError) {
        console.error("Gemini API call failed:", geminiError.message);
        replyText = ""; // Pass to fallback
      }
    }

    // If both AI APIs fail, return a strict error message instead of offline fallback
    if (!replyText) {
        replyText = "⚠️ Sorry, the AI server is currently unavailable or taking too long to respond. Please try again in a moment.";
    }

    // 4. Save Assistant Response to Database
    const assistantMsgId = crypto.randomUUID();
    await Message.create({
      id: assistantMsgId,
      conversation_id: conversationId,
      sender: 'assistant',
      content: replyText
    });

    // Update conversation timestamp
    await Conversation.updateOne({ id: conversationId }, { updated_at: new Date() });

    // 5. Trigger Memory Consolidation in background (async)
    setTimeout(() => {
      consolidateMemory(req.userId, message, replyText);
    }, 0);

    res.json({
      sender: 'assistant',
      content: replyText,
      created_at: new Date()
    });

  } catch (error) {
    console.error('Chat routing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Premium Text-to-Speech Endpoint (ElevenLabs)
app.post('/api/tts', authMiddleware, async (req, res) => {
  const { text } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: 'ElevenLabs API key is missing from .env' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; 
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      return res.status(response.status).json({ error: 'ElevenLabs API request failed' });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    });

    const { Readable } = require('stream');
    Readable.fromWeb(response.body).pipe(res);

  } catch (error) {
    console.error('TTS routing error:', error);
    res.status(500).json({ error: 'Internal server error during TTS' });
  }
});

// --- DharmaX / Sakha AI Feature Endpoints ---

// API Route for AI Scripture Explainer
app.post('/api/explain-scripture', async (req, res) => {
  try {
    const { text, source } = req.body;
    const prompt = `You are an insightful, modern spiritual guide for a Gen Z audience. 
Explain the following scripture snippet in a highly relatable, easy-to-understand way. Keep it profound and actionable, without being preachy or using cringe slang. Focus on mental clarity and modern struggles like anxiety or purpose.
Source: ${source}
Scripture: "${text}"

Provide a concise, 2-3 paragraph explanation.`;

    // Try Groq first (fast & reliable)
    const groqKeys = process.env.GROQ_API_KEYS
      ? process.env.GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k.startsWith('gsk_'))
      : process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [];

    let explanation = '';
    for (const key of groqKeys.sort(() => 0.5 - Math.random())) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 600, temperature: 0.7 })
        });
        if (groqRes.ok) {
          const data = await groqRes.json();
          explanation = data.choices[0].message.content;
          break;
        }
      } catch (_) {}
    }

    // Fallback to Gemini if Groq failed
    if (!explanation) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        explanation = (await result.response).text();
      }
    }

    if (!explanation) {
      return res.status(503).json({ error: 'All AI providers are currently unavailable. Please try again shortly.' });
    }

    res.json({ explanation });
  } catch (error) {
    console.error('AI Explain Scripture Error:', error);
    res.status(500).json({ error: 'Failed to generate explanation.' });
  }
});

// API Route for Journal Analysis
app.post('/api/analyze-journal', async (req, res) => {
  try {
    const { entry } = req.body;
    const prompt = `You are an empathetic, insightful spiritual guide. 
Analyze the following journal entry and provide a JSON response with ONLY these keys (no markdown fences):
- "insights": A profound observation about their entry.
- "wisdom": A relevant piece of wisdom or scripture snippet that relates to their thoughts.
- "actions": 1-2 practical, actionable next steps for them.
- "tone": A short summary of their emotional tone (e.g., "Anxious but hopeful").

Respond ONLY with a valid JSON object, no explanation or markdown.

Journal entry: "${entry}"`;

    // Try Groq first
    const groqKeys = process.env.GROQ_API_KEYS
      ? process.env.GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k.startsWith('gsk_'))
      : process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [];

    let analysisText = '';
    for (const key of groqKeys.sort(() => 0.5 - Math.random())) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 600, temperature: 0.7, response_format: { type: 'json_object' } })
        });
        if (groqRes.ok) {
          const data = await groqRes.json();
          analysisText = data.choices[0].message.content;
          break;
        }
      } catch (_) {}
    }

    // Fallback to Gemini
    if (!analysisText) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { responseMimeType: 'application/json' } });
        const result = await model.generateContent(prompt);
        analysisText = (await result.response).text();
      }
    }

    if (!analysisText) {
      return res.status(503).json({ error: 'AI service unavailable. Please try again.' });
    }

    // Strip markdown fences if present
    const cleaned = analysisText.replace(/```json\n?|```\n?/g, '').trim();
    res.json(JSON.parse(cleaned || '{}'));
  } catch (error) {
    console.error('AI Analyze Journal Error:', error);
    res.status(500).json({ error: 'Failed to analyze journal.' });
  }
});

// API Route for Live AI Chat (streaming) - Groq primary, Gemini fallback
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const systemInstruction = `You are Noerax — a deeply wise, calm, and modern spiritual AI guide trained on Eastern philosophy (Vedanta, Buddhism, Taoism), Stoicism, and modern psychology. 
You speak with warmth, clarity, and depth — never preachy, never using cringe slang, always relatable for a Gen Z audience struggling with anxiety, purpose, burnout, and disconnection.
Keep responses concise (2-4 short paragraphs max), actionable, and grounding. Reference specific scriptures or philosophers when relevant. Use "•" for any lists.`;

  // Build messages array for Groq (OpenAI-compatible format)
  const groqMessages = [{ role: 'system', content: systemInstruction }];
  for (const m of (history || [])) {
    // Skip initial AI greeting (role ai without a preceding user message)
    if (m.role === 'ai' || m.role === 'model') {
      groqMessages.push({ role: 'assistant', content: m.content });
    } else {
      groqMessages.push({ role: 'user', content: m.content });
    }
  }
  groqMessages.push({ role: 'user', content: message });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // --- Try Groq with streaming ---
  const groqKeys = process.env.GROQ_API_KEYS
    ? process.env.GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k.startsWith('gsk_'))
    : process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [];

  const shuffledKeys = [...groqKeys].sort(() => 0.5 - Math.random());

  for (const key of shuffledKeys) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: groqMessages,
          max_tokens: 500,
          temperature: 0.7,
          stream: true
        })
      });

      if (!groqRes.ok) {
        console.warn(`Groq key failed (${groqRes.status}), trying next...`);
        continue;
      }

      // Stream Groq response as SSE
      const reader = groqRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const text = json.choices?.[0]?.delta?.content;
              if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
              }
            } catch (_) {}
          }
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return; // Success — exit handler
    } catch (err) {
      console.warn(`Groq streaming error: ${err.message}, trying next key...`);
    }
  }

  // --- Groq failed, fallback to Gemini ---
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.write(`data: ${JSON.stringify({ text: 'All AI providers unavailable. Please try again.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `You are Noerax — a deeply wise, calm, and modern spiritual AI guide trained on Eastern philosophy (Vedanta, Buddhism, Taoism), Stoicism, and modern psychology. 
You speak with warmth, clarity, and depth — never preachy, never using cringe slang, always relatable for a Gen Z audience struggling with anxiety, purpose, burnout, and disconnection.
Keep responses concise (2-4 short paragraphs max), actionable, and grounding. Reference specific scriptures or philosophers when relevant. Use "•" for any lists.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction
    });

    // Sanitize history: Gemini SDK requires history to start with 'user' and strictly alternate user/model
    let rawHistory = (history || []).map((msg) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Drop any leading non-user messages (e.g. initial AI greeting)
    while (rawHistory.length > 0 && rawHistory[0].role !== 'user') {
      rawHistory.shift();
    }

    // Enforce strict alternation: user, model, user, model...
    const cleanHistory = [];
    let expectedRole = 'user';
    for (const entry of rawHistory) {
      if (entry.role === expectedRole) {
        cleanHistory.push(entry);
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    // If last history entry is a user turn, pop it (current message IS that user turn)
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
      cleanHistory.pop();
    }

    const chatSession = model.startChat({ history: cleanHistory });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await chatSession.sendMessageStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('AI Chat Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get AI response.' });
    } else {
      res.write(`data: ${JSON.stringify({ text: ' Response interrupted.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});


// Start Database and then Server
getDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Express Backend Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('🔴 Database failed to start:', err);
});
