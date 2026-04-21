const Joi = require('joi');
const firebaseService = require('../services/firebase.service');
const { catchAsync } = require('../middleware/error.handler');

/**
 * Get chat history (Private per session)
 */
const getHistory = catchAsync(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return res.json([]);
  
  const history = await firebaseService.getHistory(sessionId, 10);
  res.json(history);
});

/**
 * Save quiz score
 */
const saveScore = catchAsync(async (req, res) => {
  const schema = Joi.object({
    score: Joi.number().required(),
    total: Joi.number().required(),
    percentage: Joi.number().optional()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const sessionId = req.headers['x-session-id'] || `session_${Date.now()}`;
  await firebaseService.saveScore({
    ...value,
    percentage: value.percentage || Math.round((value.score / value.total) * 100),
    sessionId
  });

  res.json({ saved: true });
});

module.exports = {
  getHistory,
  saveScore
};
