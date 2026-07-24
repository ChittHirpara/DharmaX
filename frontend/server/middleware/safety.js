const CRISIS_KEYWORDS = [
  /\bsuicid/i,
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bself-harm/i,
  /\bself harm/i,
  /\bcut myself\b/i,
  /\bhanging myself\b/i,
  /\boverdosing\b/i,
  /\bcommitting suicide\b/i,
  /\bdo not want to live\b/i,
  /\bdont want to live\b/i,
  /\bbetter off dead\b/i
];

function safetyMiddleware(req, res, next) {
  const { message } = req.body;
  if (!message) {
    return next();
  }

  const isCrisis = CRISIS_KEYWORDS.some(regex => regex.test(message));

  if (isCrisis) {
    console.warn(`[SAFETY TRIGGERED] Crisis keywords detected in message: "${message}"`);
    return res.status(200).json({
      isCrisis: true,
      sender: 'assistant',
      content: "I hear that you are going through a deeply heavy time, and I am so glad you reached out. However, I want to make sure you have the exact care and professional support you deserve right now. Please know that you are not alone, and there is help available.\n\nYou can reach out to the National Crisis Lifeline by calling or texting 988 (available 24/7, free, and confidential) or visit 988lifeline.org. If you are in immediate danger, please contact local emergency services. Please take care of yourself.",
      resources: {
        lifeline: "988 Crisis & Suicide Lifeline",
        phone: "988",
        website: "https://988lifeline.org"
      }
    });
  }

  next();
}

module.exports = { safetyMiddleware };
