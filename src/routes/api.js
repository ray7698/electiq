const express = require('express');
const aiController = require('../controllers/ai.controller');
const userController = require('../controllers/user.controller');
const mapController = require('../controllers/map.controller');
const rateLimit = require('express-rate-limit');
const constants = require('../constants');

const router = express.Router();

// Rate limiters
const chatLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: constants.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AI Routes
 */
router.post('/chat', chatLimiter, aiController.chat);
router.post('/quiz', apiLimiter, aiController.getQuiz);
router.post('/translate-ui', apiLimiter, aiController.translateUI);

/**
 * Map Routes
 */
router.get('/geocode', apiLimiter, mapController.geocode);
router.get('/maps-config', apiLimiter, mapController.getConfig);

/**
 * User/Data Routes
 */
router.get('/history', userController.getHistory);
router.post('/score', userController.saveScore);

module.exports = router;
