const Joi = require('joi');
const geminiService = require('../services/gemini.service');
const firebaseService = require('../services/firebase.service');
const { catchAsync } = require('../middleware/error.handler');
const { sanitize } = require('../utils/sanitizer');
const translationService = require('../services/translation.service');
const config = require('../config');

// ---- SIMPLE IN-MEMORY CACHE ----
const cache = new Map();

function cacheGet(key) { return cache.get(key); }
function cacheSet(key, value) {
  if (cache.size >= config.cacheMax) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

/**
 * Controller for AI Chat
 */
const chat = catchAsync(async (req, res) => {
  // Validation schema
  const schema = Joi.object({
    message: Joi.string().trim().max(500).required(),
    lang: Joi.string().length(2).optional().default('en')
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { message: rawMessage, lang } = value;
  const message = sanitize(rawMessage);
  const cacheKey = `${lang}:${message.toLowerCase()}`;

  // Check cache
  const cached = cacheGet(cacheKey);
  if (cached) {
    return res.json({ reply: cached, cached: true });
  }

  let reply = await geminiService.getChatReply(message);

  // Translate if necessary
  if (lang && lang !== 'en') {
    reply = await translationService.translateText(reply, lang);
  }

  // Cache the result
  cacheSet(cacheKey, reply);

  // Log to firebase (async, don't wait for response)
  const sessionId = req.headers['x-session-id'] || `session_${Date.now()}`;
  firebaseService.logConversation({
    userMessage: message,
    botReply: reply,
    sessionId
  }).catch(err => console.warn('Firebase log failed:', err.message));

  res.json({ reply });
});

/**
 * Controller for Quiz Generation
 */
const getQuiz = catchAsync(async (req, res) => {
  const lang = req.body?.lang || 'en';
  let questions = await geminiService.generateQuiz();

  if (lang && lang !== 'en') {
    // Translate each question, option and explanation
    questions = await Promise.all(questions.map(async (q) => ({
      question: await translationService.translateText(q.question, lang),
      options: await Promise.all(q.options.map(opt => translationService.translateText(opt, lang))),
      correct: await translationService.translateText(q.correct, lang),
      explanation: await translationService.translateText(q.explanation, lang)
    })));
  }

  res.json({ questions });
});

/**
 * Controller for Bulk UI Translation
 */
const translateUI = catchAsync(async (req, res) => {
  const { items, lang } = req.body;
  if (!items || !lang || lang === 'en') return res.json({ items });

  const keys = Object.keys(items);
  const values = Object.values(items);
  
  // Translate all values at once
  const translatedValues = await Promise.all(
    values.map(val => translationService.translateText(val, lang))
  );

  const translatedItems = {};
  keys.forEach((key, i) => {
    translatedItems[key] = translatedValues[i];
  });

  res.json({ items: translatedItems });
});

module.exports = {
  chat,
  getQuiz,
  translateUI
};
