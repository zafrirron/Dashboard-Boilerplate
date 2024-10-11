const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Import the database connection

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Retrieve all items from the database
 *     description: Query the PostgreSQL database to retrieve all items.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Item 1"
 *                       description:
 *                         type: string
 *                         example: "This is an item description"
 */
router.get('/', async (req, res) => {
  try {
    // Query to fetch all items from the "items" table
    const result = await pool.query('SELECT id, name, description FROM items');
    
    // Respond with the fetched data
    res.json({ message: 'Data fetched successfully', data: result.rows });
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
