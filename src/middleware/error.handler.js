const logger = require('../utils/logger');

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    logger.error(`[CRITICAL] ${err.stack}`);
  } else {
    logger.warn(`[${status.toUpperCase()}] ${message}`);
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * Wrapper to catch async errors in controller functions
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  catchAsync,
};
