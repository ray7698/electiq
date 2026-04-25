// tests/api.test.js
// API endpoint tests using supertest

global.mockGeminiResponseText = JSON.stringify([
  {
    question: 'Test Q?',
    options: ['A', 'B', 'C', 'D'],
    correct: 'A',
    explanation: 'Test explanation.',
  },
]);

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessage: async () => ({
          response: { text: () => 'Mocked Gemini reply about elections.' },
        }),
      }),
      generateContent: async () => ({
        response: {
          text: () => global.mockGeminiResponseText,
        },
      }),
    }),
  })),
}));

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  database: () => ({
    ref: () => ({
      push: jest.fn().mockResolvedValue({}),
      orderByChild: () => ({
        limitToLast: () => ({ once: jest.fn().mockResolvedValue({ val: () => ({}) }) }),
      }),
    }),
  }),
}));

const request = require('supertest');
const app = require('../server');

describe('GET /api/health', () => {
  test('returns 200 with correct shape', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('GET /', () => {
  test('returns 200 with HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
  test('does not expose raw API key placeholder', async () => {
    const res = await request(app).get('/');
    expect(res.text).not.toContain('process.env');
  });
});

describe('POST /api/chat', () => {
  test('valid message returns 200 with reply', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I register to vote?' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(typeof res.body.reply).toBe('string');
  });
  test('empty body returns 400', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
  });
  test('empty message returns 400', async () => {
    const res = await request(app).post('/api/chat').send({ message: '' });
    expect(res.status).toBe(400);
  });
  test('message over 500 chars returns 400', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'a'.repeat(501) });
    expect(res.status).toBe(400);
  });
  test('non-string message returns 400', async () => {
    const res = await request(app).post('/api/chat').send({ message: 12345 });
    expect(res.status).toBe(400);
  });
  test('XSS payload is handled safely', async () => {
    const res = await request(app).post('/api/chat').send({ message: '<script>alert(1)</script>' });
    expect([200, 400]).toContain(res.status);
  });
});

describe('POST /api/quiz', () => {
  afterEach(() => {
    global.mockGeminiResponseText = JSON.stringify([
      {
        question: 'Test Q?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
        explanation: 'Test explanation.',
      },
    ]);
  });

  test('returns 200 with questions array', async () => {
    const res = await request(app).post('/api/quiz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);
  });

  test('quiz handles malformed Gemini JSON gracefully', async () => {
    global.mockGeminiResponseText = 'garbage response not json';
    const res = await request(app).post('/api/quiz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBe(5);
  });
});

describe('POST /api/translate-ui', () => {
  test('returns original items if lang is en', async () => {
    const items = { title: 'Hello', desc: 'World' };
    const res = await request(app).post('/api/translate-ui').send({ lang: 'en', items });
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual(items);
  });

  test('returns translated or fallback items for non-en language', async () => {
    const items = { title: 'Hello', desc: 'World' };
    const res = await request(app).post('/api/translate-ui').send({ lang: 'hi', items });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body.items).toHaveProperty('title');
    expect(res.body.items).toHaveProperty('desc');
  });
});

describe('POST /api/score', () => {
  test('valid score returns saved: true', async () => {
    const res = await request(app).post('/api/score').send({ score: 4, total: 5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saved', true);
  });
  test('missing fields returns 400', async () => {
    const res = await request(app).post('/api/score').send({ score: 4 });
    expect(res.status).toBe(400);
  });
  test('non-number score returns 400', async () => {
    const res = await request(app).post('/api/score').send({ score: 'four', total: 5 });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/history', () => {
  test('returns 200 with array', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
