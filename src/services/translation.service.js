const { Translate } = require('@google-cloud/translate').v2;
const config = require('../config');

// Initialize the Translate client
// It will automatically use GOOGLE_APPLICATION_CREDENTIALS if set,
// or we can pass credentials from the Firebase config as fallback.
let translate = null;
try {
  const options = {};
  if (config.firebaseServiceAccount) {
    const creds = JSON.parse(config.firebaseServiceAccount);
    options.projectId = creds.project_id;
    options.credentials = creds;
  }
  translate = new Translate(options);
  console.log('✅ Translation Service initialized');
} catch (err) {
  console.warn('⚠️ Translation Service initialization failed:', err.message);
}

/**
 * Translate text to target language
 * @param {string} text - The English text to translate
 * @param {string} targetLang - The target language code (e.g. 'hi' for Hindi)
 * @returns {Promise<string>} - The translated text
 */
async function translateText(text, targetLang) {
  if (!translate || !targetLang || targetLang === 'en') return text;
  
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.error('Translation error:', err.message);
    return text; // Fallback to original text
  }
}

module.exports = {
  translateText
};
