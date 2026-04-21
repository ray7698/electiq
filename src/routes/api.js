const express = require('express');
const aiController = require('../controllers/ai.controller');
const userController = require('../controllers/user.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiters
const chatLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });

/**
 * AI Routes
 */
router.post('/chat', chatLimiter, aiController.chat);
router.post('/quiz', aiController.getQuiz);
router.post('/translate-ui', aiController.translateUI);

/**
 * User/Data Routes
 */
router.get('/history', userController.getHistory);
router.post('/score', userController.saveScore);

module.exports = router;
