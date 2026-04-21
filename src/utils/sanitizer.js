/**
 * Sanitize user input: strip HTML, trim, limit length
 * Improved to remove scripts and styles entirely
 * @param {string} input
 * @param {number} maxLen
 * @returns {string}
 */
function sanitize(input, maxLen = 500) {
  if (typeof input !== 'string') throw new Error('Input must be a string');
  
  // Remove script and style tags and their contents
  let clean = input.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  
  // Remove all other HTML tags
  clean = clean.replace(/<[^>]*>/g, '');
  
  return clean.trim().slice(0, maxLen);
}

module.exports = {
  sanitize
};
