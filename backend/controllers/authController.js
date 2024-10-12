const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');  // Import your standard logger
const pool = require('../config/db');  // Import the database connection

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info(`Login attempt for email: ${email}`);

    // Find the user by email from the database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      logger.warn(`Invalid login attempt: email ${email} not found.`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check if the user is active
    if (!user.active) {
      logger.warn(`Login attempt for deactivated user: ${email}`);
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Compare the plaintext password with the hashed password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      logger.warn(`Invalid login attempt: incorrect password for email ${email}.`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`Successful login for email: ${email} with role: ${user.role}`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error for email: ${email}, error: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Example logout route (JWT-based applications usually handle logout on the client-side)
exports.logout = (req, res) => {
  // No server-side logic for logout in stateless JWT auth, you can clear the token on the client
  res.status(200).json({ message: 'Logged out successfully' });
};
