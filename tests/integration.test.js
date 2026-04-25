// tests/integration.test.js

const mockGeminiReply =
  'In India, you can register to vote at voters.eci.gov.in or your local ERO office.';
const mockQuizData = [
  {
    question: 'What is the voting age in India?',
    options: ['16', '18', '21', '25'],
    correct: '18',
    explanation: '18 is the minimum voting age.',
  },
];

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessage: jest.fn().mockResolvedValue({ response: { text: () => mockGeminiReply } }),
      }),
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => JSON.stringify(mockQuizData) },
      }),
    }),
  })),
}));

const mockFirebasePush = jest.fn().mockResolvedValue({});
const mockFirebaseOnce = jest.fn().mockResolvedValue({
  val: () => ({
    key1: {
      timestamp: 1000,
      userMessage: 'test question',
      botReply: 'test answer',
      sessionId: 'session_1',
    },
  }),
});

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  database: () => ({
    ref: () => ({
      push: mockFirebasePush,
      orderByChild: () => ({ limitToLast: () => ({ once: mockFirebaseOnce }) }),
    }),
  }),
}));

const request = require('supertest');

describe('Full chat flow (integration)', () => {
  let app;
  beforeAll(() => {
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
      project_id: 'test',
      type: 'service_account',
    });
    app = require('../server');
  });

  test('sends message, gets Gemini reply', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I register to vote in India?' });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBe(mockGeminiReply);
  });

  test('quiz flow returns valid questions array', async () => {
    const res = await request(app).post('/api/quiz');
    expect(res.status).toBe(200);
    expect(res.body.questions).toHaveLength(1);
    expect(res.body.questions[0]).toHaveProperty('question');
    expect(res.body.questions[0]).toHaveProperty('options');
    expect(res.body.questions[0]).toHaveProperty('correct');
  });

  test('history endpoint returns array of conversations', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('graceful degradation: score saves even without Firebase in production', async () => {
    const res = await request(app).post('/api/score').send({ score: 3, total: 5 });
    expect(res.status).toBe(200);
    expect(res.body.saved).toBe(true);
  });
});
