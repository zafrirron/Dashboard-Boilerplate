const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Field:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The field name
 *         type:
 *           type: string
 *           description: The field type (e.g., string, number, boolean)
 *       required:
 *         - name
 *         - type
 * 
 *     RecordModel:
 *       type: object
 *       properties:
 *         tableName:
 *           type: string
 *           description: Name of the table
 *         fields:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Field'
 *       required:
 *         - tableName
 *         - fields
 */

/**
 * @swagger
 * /record:
 *   post:
 *     summary: Add a new record model
 *     tags: [Record Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordModel'
 *     responses:
 *       201:
 *         description: Record model saved successfully
 *       500:
 *         description: Server error
 */
router.post('/record', async (req, res) => {
  const { tableName, fields } = req.body;

  try {
    const query = 'INSERT INTO record_models (table_name, fields) VALUES ($1, $2)';
    await pool.query(query, [tableName, fields]);
    res.status(201).json({ message: 'Record model saved successfully' });
  } catch (error) {
    console.error('Error saving model:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /record/generate-sql:
 *   post:
 *     summary: Generate SQL for table creation based on the record model
 *     tags: [Record Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordModel'
 *     responses:
 *       200:
 *         description: Generated SQL for table creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sql:
 *                   type: string
 *                   description: Generated SQL statement
 *       500:
 *         description: Server error
 */
router.post('/record/generate-sql', async (req, res) => {
  const { tableName, fields } = req.body;

  const fieldDefinitions = fields
    .map((field) => {
      let sqlType;
      switch (field.type) {
        case 'string':
          sqlType = 'VARCHAR(255)';
          break;
        case 'number':
          sqlType = 'INT';
          break;
        case 'boolean':
          sqlType = 'BOOLEAN';
          break;
        case 'date':
          sqlType = 'DATE';
          break;
        case 'email':
          sqlType = 'VARCHAR(255)';
          break;
        default:
          sqlType = 'VARCHAR(255)';
      }

      return `${field.name} ${sqlType}`;
    })
    .join(', ');

  const sql = `CREATE TABLE ${tableName} (${fieldDefinitions});`;

  res.json({ sql });
});

module.exports = router;
