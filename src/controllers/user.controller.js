const Joi = require('joi');
const firebaseService = require('../services/firebase.service');
const { catchAsync } = require('../middleware/error.handler');
const constants = require('../constants');

const AppError = require('../utils/AppError');

/**
 * Get chat history (Private per session)
 */
const getHistory = catchAsync(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return res.json([]);

  const history = await firebaseService.getHistory(sessionId, constants.HISTORY_LIMIT);
  res.json(history);
});

/**
 * Save quiz score
 */
const saveScore = catchAsync(async (req, res) => {
  const schema = Joi.object({
    score: Joi.number().required(),
    total: Joi.number().required(),
    percentage: Joi.number().optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const sessionId = req.headers['x-session-id'] || `session_${Date.now()}`;
  await firebaseService.saveScore({
    ...value,
    percentage: value.percentage || Math.round((value.score / value.total) * 100),
    sessionId,
  });

  res.json({ saved: true });
});

module.exports = {
  getHistory,
  saveScore,
};
