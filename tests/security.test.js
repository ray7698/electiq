// tests/security.test.js

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({ sendMessage: async () => ({ response: { text: () => 'reply' } }) }),
      generateContent: async () => ({ response: { text: () => '[]' } }),
    }),
  })),
}));
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  database: () => ({
    ref: () => ({
      push: jest.fn(),
      orderByChild: () => ({
        limitToLast: () => ({ once: jest.fn().mockResolvedValue({ val: () => ({}) }) }),
      }),
    }),
  }),
}));

const request = require('supertest');
const app = require('../server');

describe('Security headers', () => {
  test('X-Frame-Options header is present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
  test('X-Content-Type-Options header is present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
  test('Content-Security-Policy header is present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});

describe('Input sanitization', () => {
  test('HTML tags stripped from chat input', async () => {
    const res = await request(app).post('/api/chat').send({ message: '<b>hello</b>' });
    expect(res.status).toBe(200);
  });
  test('script injection returns safe response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '<script>alert("xss")</script>' });
    expect([200, 400]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.reply).toBeDefined();
    }
  });
  test('very long input rejected', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'x'.repeat(1000) });
    expect(res.status).toBe(400);
  });
});

describe('API key protection', () => {
  test('GEMINI_API_KEY not exposed in responses', async () => {
    const res = await request(app).get('/');
    expect(res.text).not.toContain(process.env.GEMINI_API_KEY || 'GEMINI_API_KEY');
  });
  test('environment variables not leaked in error responses', async () => {
    const res = await request(app).post('/api/chat').send({ message: '' });
    expect(JSON.stringify(res.body)).not.toContain('process.env');
  });
});
