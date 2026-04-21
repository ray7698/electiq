const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

/**
 * Send a message to the Gemini election assistant
 */
async function getChatReply(message) {
  const systemPrompt = `You are ElectIQ, an expert election education assistant. You help citizens understand democratic processes, voter rights, election timelines, and civic duties. You are knowledgeable about Indian, US, and UK election processes. You give clear, unbiased, factual answers and encourage civic participation. Keep answers concise but complete.`;

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am ElectIQ, ready to help citizens learn about elections.' }] }
    ]
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

/**
 * Generate quiz questions using Gemini
 */
async function generateQuiz() {
  const prompt = `Generate exactly 5 multiple choice questions about election processes (India, USA, UK). Return ONLY a valid JSON array. Each item: {question, options[4], correct, explanation}.`;
  
  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  
  // Clean up markdown markers if Gemini adds them
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(text);
}

module.exports = {
  getChatReply,
  generateQuiz
};
