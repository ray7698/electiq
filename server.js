/**
 * ElectIQ — Backend Server
 * Google Services: Gemini API, Firebase Realtime DB, Cloud Run, Google Maps (frontend)
 */

const express = require('express');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const fs   = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app  = express();
const PORT = process.env.PORT || 8080;

// ---- GOOGLE SERVICES INIT ----

// 1. Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// 2. Firebase Admin
let db = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const admin = require('firebase-admin');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
    }
    db = admin.database();
    console.log('✅ Firebase initialized');
  }
} catch (err) {
  console.warn('⚠️ Firebase not available:', err.message);
}

// ---- SECURITY MIDDLEWARE ----
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://maps.googleapis.com", "https://fonts.googleapis.com", "'unsafe-inline'"],
      styleSrc:  ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc:   ["'self'", "https://fonts.gstatic.com"],
      imgSrc:    ["'self'", "https://maps.googleapis.com", "https://maps.gstatic.com", "data:"],
      connectSrc:["'self'", "https://maps.googleapis.com"],
    }
  }
}));

app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const globalLimiter = rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false });
const chatLimiter   = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });
app.use(globalLimiter);

// ---- SIMPLE IN-MEMORY CACHE ----
const cache = new Map();
const CACHE_MAX = 50;

function cacheGet(key) { return cache.get(key); }
function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, value);
}

// ---- INPUT SANITIZATION ----
/**
 * Sanitize user input: strip HTML, trim, limit length
 * @param {string} input
 * @param {number} maxLen
 * @returns {string}
 */
function sanitize(input, maxLen = 500) {
  if (typeof input !== 'string') throw new Error('Input must be a string');
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

// ---- STATIC FILES ----
// Inject Maps API key into index.html
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('__MAPS_API_KEY__', process.env.MAPS_API_KEY || '');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-store');
  res.send(html);
});
app.use(express.static(__dirname, {
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) return;
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

// ---- ENDPOINTS ----

/**
 * GET /api/health — health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

/**
 * POST /api/chat — Gemini-powered election assistant
 */
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const raw = req.body?.message;
    if (!raw || typeof raw !== 'string' || !raw.trim()) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }
    if (raw.length > 500) {
      return res.status(400).json({ error: 'Message must be 500 characters or less' });
    }

    const message = sanitize(raw);
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}`;

    // Check cache
    const cached = cacheGet(message.toLowerCase());
    if (cached) {
      return res.json({ reply: cached, cached: true });
    }

    // Call Gemini
    const systemPrompt = `You are ElectIQ, an expert election education assistant. You help citizens understand democratic processes, voter rights, election timelines, and civic duties. You are knowledgeable about Indian (Lok Sabha/Vidhan Sabha), US Presidential, and UK General election processes. You give clear, unbiased, factual answers and encourage civic participation. Keep answers concise but complete. Use simple language accessible to all citizens.`;

    const chat = geminiModel.startChat({
      history: [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'Understood. I am ElectIQ, ready to help citizens learn about elections.' }] }]
    });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // Cache the response
    cacheSet(message.toLowerCase(), reply);

    // Log to Firebase
    if (db) {
      try {
        await db.ref('/electiq/conversations').push({ timestamp: Date.now(), userMessage: message, botReply: reply, sessionId });
      } catch (fbErr) {
        console.warn('Firebase write error:', fbErr.message);
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

/**
 * GET /api/history — last 10 conversations from Firebase
 */
app.get('/api/history', async (req, res) => {
  if (!db) return res.json([]);
  try {
    const snap = await db.ref('/electiq/conversations').orderByChild('timestamp').limitToLast(10).once('value');
    const data = snap.val() || {};
    const entries = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
    res.json(entries);
  } catch (err) {
    console.error('History error:', err.message);
    res.json([]);
  }
});

/**
 * POST /api/quiz — generate quiz questions via Gemini
 */
app.post('/api/quiz', async (req, res) => {
  try {
    const prompt = `Generate exactly 5 multiple choice questions about election processes (include questions about India, USA, and UK elections). Return ONLY a valid JSON array with no markdown, no code blocks, no explanation. Each item must have: question (string), options (array of 4 strings), correct (string matching one option), explanation (string). Example format: [{"question":"...","options":["a","b","c","d"],"correct":"a","explanation":"..."}]`;

    const result = await geminiModel.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const questions = JSON.parse(text);
    if (!Array.isArray(questions)) throw new Error('Invalid quiz format');

    res.json({ questions });
  } catch (err) {
    console.error('Quiz error:', err.message);
    // Fallback questions
    res.json({ questions: [
      { question: "What is the minimum voting age in India?", options: ["16", "18", "21", "25"], correct: "18", explanation: "Indian citizens must be 18 years or older to vote in any election." },
      { question: "How many electoral votes are needed to win the US Presidency?", options: ["218", "270", "300", "435"], correct: "270", explanation: "A candidate needs 270 of 538 electoral votes to win the US Presidential election." },
      { question: "What voting system does the UK use for general elections?", options: ["Proportional Representation", "Alternative Vote", "First-Past-The-Post", "Single Transferable Vote"], correct: "First-Past-The-Post", explanation: "The UK uses FPTP where the candidate with the most votes in each constituency wins." },
      { question: "What is the Model Code of Conduct in India?", options: ["A manual for election officials", "Guidelines political parties must follow during elections", "A voter registration form", "Rules for counting votes"], correct: "Guidelines political parties must follow during elections", explanation: "The MCC is a set of guidelines issued by the ECI to regulate the conduct of political parties and candidates during elections." },
      { question: "What is a 'hung parliament'?", options: ["When parliament is dissolved", "When no party wins an outright majority", "When the Prime Minister resigns", "When elections are postponed"], correct: "When no party wins an outright majority", explanation: "A hung parliament occurs when no single party wins enough seats for a majority, requiring coalition negotiations." },
    ]});
  }
});

/**
 * POST /api/score — save quiz score to Firebase
 */
app.post('/api/score', async (req, res) => {
  try {
    const { score, total, percentage } = req.body;
    if (score === undefined || total === undefined) {
      return res.status(400).json({ error: 'score and total are required' });
    }
    if (typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ error: 'score and total must be numbers' });
    }

    if (db) {
      await db.ref('/electiq/scores').push({
        timestamp: Date.now(),
        score,
        total,
        percentage: percentage || Math.round((score / total) * 100),
        sessionId: req.headers['x-session-id'] || `session_${Date.now()}`
      });
    }

    res.json({ saved: true });
  } catch (err) {
    console.error('Score error:', err.message);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// ---- START ----
app.listen(PORT, () => {
  console.log(`🗳 ElectIQ running on port ${PORT}`);
  console.log(`🤖 Gemini: ${process.env.GEMINI_API_KEY ? '✅' : '❌ missing key'}`);
  console.log(`🔥 Firebase: ${db ? '✅' : '⚠️ not configured'}`);
  console.log(`🗺  Maps: ${process.env.MAPS_API_KEY ? '✅' : '⚠️ not configured'}`);
});

module.exports = app;
