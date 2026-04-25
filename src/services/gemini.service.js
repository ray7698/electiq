const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const constants = require('../constants');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: constants.GEMINI_MODEL });

/**
 * Send a message to the Gemini election assistant
 */
async function getChatReply(message) {
  const systemPrompt = `You are ElectIQ, an expert election education assistant. You help citizens understand democratic processes, voter rights, election timelines, and civic duties. You are knowledgeable about Indian, US, and UK election processes. You give clear, unbiased, factual answers and encourage civic participation. Keep answers concise but complete.`;

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      {
        role: 'model',
        parts: [
          { text: 'Understood. I am ElectIQ, ready to help citizens learn about elections.' },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

/**
 * Generate quiz questions using Gemini
 */
async function generateQuiz() {
  const prompt = `Generate exactly 5 multiple choice questions about election processes (India, USA, UK). Return ONLY a valid JSON array. Each item: {question, options[4], correct, explanation}.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean up markdown markers if Gemini adds them
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(text);
  } catch (error) {
    logger.error('Quiz Generation Error:', error);
    // Graceful fallback if Gemini or JSON parsing fails
    return [
      {
        question:
          'What is the minimum voting age in most democratic countries like India, USA, and UK?',
        options: ['16', '18', '21', '25'],
        correct: '18',
        explanation: 'In India, the USA, and the UK, the standard minimum voting age is 18.',
      },
      {
        question: 'Which document is usually required to cast a vote in person?',
        options: [
          'Passport only',
          'Library Card',
          'Voter ID or approved Photo ID',
          'Birth Certificate',
        ],
        correct: 'Voter ID or approved Photo ID',
        explanation:
          'Most democracies require a valid voter registration or photo ID to cast a ballot.',
      },
      {
        question: 'When are US Presidential Elections held?',
        options: [
          'First Monday in November',
          'First Tuesday after the first Monday in November',
          'Last Tuesday in October',
          'November 1st',
        ],
        correct: 'First Tuesday after the first Monday in November',
        explanation:
          'By law, US Election Day is the Tuesday following the first Monday in November.',
      },
      {
        question: 'What is the voting system used in UK General Elections?',
        options: [
          'Proportional Representation',
          'First-Past-The-Post',
          'Ranked Choice',
          'Two-Round System',
        ],
        correct: 'First-Past-The-Post',
        explanation:
          'The UK uses the First-Past-The-Post (FPTP) system for parliamentary elections.',
      },
      {
        question: 'What is the Model Code of Conduct in India?',
        options: [
          'A dress code for politicians',
          'Guidelines for political parties and candidates',
          'A law that bans campaigning',
          'A guide for voters',
        ],
        correct: 'Guidelines for political parties and candidates',
        explanation:
          'The Model Code of Conduct regulates political parties and candidates prior to elections.',
      },
    ];
  }
}

module.exports = {
  getChatReply,
  generateQuiz,
};
