/**
 * ElectIQ — Server Entry Point
 * Refactored for clean modular architecture
 */
const logger = require('./src/utils/logger');
const app = require('./src/app');
const config = require('./src/config');
const firebaseService = require('./src/services/firebase.service');

const PORT = config.port;

// Only start the server if this file is run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`🗳  ElectIQ running on port ${PORT}`);
    logger.info(`🤖 Gemini API: ${config.geminiApiKey ? '✅ Configured' : '❌ Missing Key'}`);
    logger.info(
      `🔥 Firebase: ${firebaseService.isConnected() ? '✅ Connected' : '⚠️ Not Connected'}`,
    );
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
}

// Export the app for testing (supertest)
module.exports = app;
