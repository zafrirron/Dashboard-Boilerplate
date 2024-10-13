const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { findOrCreateUser } = require('../controllers/userController'); // Implement this controller
const pool = require('../config/db'); // PostgreSQL connection pool
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const logger = require('../utils/logger');  // Import your standard logger

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by clearing the JWT token on the frontend.
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', (req, res) => {
    // There is no backend operation for logout in a stateless JWT system
    res.status(200).json({ message: 'Logout successful' });
  });

 
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the logged-in user using the JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
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
 *                 role:
 *                   type: string
 *                 active:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
  router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      token = req.cookies.token; // Fallback to token from cookies if not in headers
    }
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      //logger.info(`Profile data requested`);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;

      logger.info(`Token for email: ${email} `);

      // Fetch the user's data from the database
      const result = await pool.query('SELECT id, name, email, role, active, created_at FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result.rows[0];
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Google login
 *     description: Authenticate users via Google OAuth.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid token or authentication failed
 */
// POST route for Google login
router.post('/google-login', authController.googleLogin);
  
module.exports = router;
