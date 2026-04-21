/**
 * Centralized Configuration logic for ElectIQ
 */
require('dotenv').config();

const config = {
  port: process.env.PORT || 8080,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mapsApiKey: process.env.MAPS_API_KEY || '',
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || null,
  isProd: process.env.NODE_ENV === 'production',
  cacheMax: 50,
};

// Simple validation
if (!config.geminiApiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set');
}

module.exports = config;
