/**
 * ElectIQ — Server Entry Point
 * Refactored for clean modular architecture
 */
const app = require('./src/app');
const config = require('./src/config');
const firebaseService = require('./src/services/firebase.service');

const PORT = config.port;

// Only start the server if this file is run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🗳  ElectIQ running on port ${PORT}`);
    console.log(`🤖 Gemini API: ${config.geminiApiKey ? '✅ Configured' : '❌ Missing Key'}`);
    console.log(`🔥 Firebase: ${firebaseService.isConnected() ? '✅ Connected' : '⚠️ Not Connected'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

// Export the app for testing (supertest)
module.exports = app;
