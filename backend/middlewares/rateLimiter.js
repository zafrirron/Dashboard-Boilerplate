// backend/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Apply rate limiter to all API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

module.exports = apiLimiter;
