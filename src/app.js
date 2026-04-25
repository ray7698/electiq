const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const apiRoutes = require('./routes/api');
const { errorHandler } = require('./middleware/error.handler');

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://maps.googleapis.com',
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net',
          "'unsafe-inline'",
        ],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'https://maps.googleapis.com', 'https://maps.gstatic.com', 'data:'],
        connectSrc: ["'self'", 'https://maps.googleapis.com', 'https://cdn.jsdelivr.net'],
      },
    },
  }),
);

app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Static Files & Index Injection
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../index.html');
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(filePath);
});

// Serve frontend assets
app.use(
  express.static(path.join(__dirname, '..'), {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) return;
      res.setHeader('Cache-Control', 'public, max-age=3600');
    },
  }),
);

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
