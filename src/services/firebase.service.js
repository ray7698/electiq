const admin = require('firebase-admin');
const config = require('../config');
const logger = require('../utils/logger');
const constants = require('../constants');

let db = null;

if (config.firebaseServiceAccount) {
  try {
    const serviceAccount = JSON.parse(config.firebaseServiceAccount);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
      });
    }
    db = admin.database();
    logger.info('✅ Firebase Service initialized');
  } catch (err) {
    logger.warn('⚠️ Firebase initialization failed:', err.message);
  }
}

/**
 * Log a conversation entry
 */
async function logConversation(entry) {
  if (!db) return;
  return db.ref('/electiq/conversations').push({
    ...entry,
    timestamp: Date.now(),
  });
}

/**
 * Get recent conversations for a specific session (Privacy)
 */
async function getHistory(sessionId, limit = constants.HISTORY_LIMIT) {
  if (!db || !sessionId) return [];

  const snap = await db
    .ref('/electiq/conversations')
    .orderByChild('sessionId')
    .equalTo(sessionId)
    .limitToLast(limit)
    .once('value');

  const data = snap.val() || {};
  return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Save a quiz score
 */
async function saveScore(scoreData) {
  if (!db) return;
  return db.ref('/electiq/scores').push({
    ...scoreData,
    timestamp: Date.now(),
  });
}

module.exports = {
  logConversation,
  getHistory,
  saveScore,
  isConnected: () => !!db,
};
