// tests/helpers.js — shared utilities for testing

const { sanitize } = require('../src/utils/sanitizer');

/**
 * Generate a session ID
 * @returns {string}
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

module.exports = { sanitize, generateSessionId };
