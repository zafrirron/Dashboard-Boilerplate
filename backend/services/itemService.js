const itemModel = require('../models/itemModel');
const logger = require('../utils/logger');  // Import the logger

// Fetch all items
exports.getAllItems = async () => {
  try {
    const items = await itemModel.getAll();
    logger.info('Retrieved items from database');  // Log successful DB access
    return items;
  } catch (error) {
    logger.error(`Database query failed: ${error.message}`);  // Log error on failure
    throw error;
  }
};
