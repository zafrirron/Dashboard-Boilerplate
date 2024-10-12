const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users with their name, email, active status, role, and creation date.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   active:
 *                     type: boolean
 *                   role:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, active, role, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new user
/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Add a new user
 *     description: Create a new user with name, email, and hashed password. The role and active status are set to defaults.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: logged
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 active:
 *                   type: boolean
 *                 role:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 */
router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, active, role, created_at',
      [name, email, hashedPassword, role]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user details
/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update the name and role of a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 */
router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, role } = req.body;
  try {
    await pool.query('UPDATE users SET name = $1, role = $2 WHERE id = $3', [name, role, userId]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle active state of a user
/**
 * @swagger
 * /api/admin/users/{id}/toggle-active:
 *   post:
 *     summary: Toggle active state of a user
 *     description: Toggle the active state of a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User active state toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: boolean
 *                   example: true
 */
router.post('/users/:id/toggle-active', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('UPDATE users SET active = NOT active WHERE id = $1 RETURNING active', [userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling user active state:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Remove a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
