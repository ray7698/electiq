// tests/helpers.js — shared utilities for testing

/**
 * Sanitize user input: strip HTML, trim, limit length
 * @param {string} input
 * @param {number} maxLen
 * @returns {string}
 */
function sanitize(input, maxLen = 500) {
  if (typeof input !== 'string') throw new Error('Input must be a string');
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

/**
 * Generate a session ID
 * @returns {string}
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

module.exports = { sanitize, generateSessionId };
