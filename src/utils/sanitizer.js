const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const constants = require('../constants');

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize user input using DOMPurify for hardened XSS protection.
 * Removes all HTML tags by default, trims, and limits length.
 * @param {string} input
 * @param {number} maxLen
 * @returns {string}
 */
function sanitize(input, maxLen = constants.MAX_MESSAGE_LEN) {
  if (typeof input !== 'string') throw new Error('Input must be a string');

  // DOMPurify configuration: strip all HTML
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });

  return clean.trim().slice(0, maxLen);
}

module.exports = {
  sanitize,
};
