const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
require('dotenv').config();  // Load environment variables

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',  // Use LOG_LEVEL from .env, default to 'info'
  format: combine(
    colorize(),              // Colorize output for the console
    timestamp(),             // Add a timestamp to each log
    logFormat                // Format the log output
  ),
  transports: [
    new transports.Console(),  // Log to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
    new transports.File({ filename: 'logs/combined.log' })  // Log all messages to a file
  ]
});

module.exports = logger;
