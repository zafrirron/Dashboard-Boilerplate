const logger = require('../utils/logger');  // Import the logger

// Global error handler
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message} | Stack: ${err.stack}`);
  res.status(500).json({ message: 'An internal server error occurred' });
};

module.exports = errorHandler;
