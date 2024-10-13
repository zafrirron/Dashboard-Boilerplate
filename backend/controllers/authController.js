const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');  // Import your standard logger
const pool = require('../config/db');  // Import the database connection
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Example: Login function or wherever you generate JWT
const generateToken = (user) => {
  // Fetch the token expiration time from .env or set a default value (in seconds)
  const tokenExpirationTime = process.env.TOKEN_EXPIRY_TIME || '3600'; // Default is 1 hour (3600 seconds)

  // Generate the JWT token using the user's details and the expiration time from .env
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: `${tokenExpirationTime}s`,  // Use seconds for expiresIn
    }
  );

  return token;
};

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
    const token = generateToken(user);

    logger.info(`Successful login for email: ${email} with role: ${user.role}`);

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error for email: ${email}, error: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Use the Google Client ID from the environment variables

exports.googleLogin = async (req, res) => {
  let { token } = req.body;
  //logger.info(`Got google login request: ${token} `);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the Google Client ID here
    });

    const { email, name } = ticket.getPayload();
    logger.info(`Google login email: ${email} `);

    // Check if the user already exists in your database
    let user = await User.findByEmail(email);
    if (!user || !user.active) {
      // If the user doesn't exist, create a new user in the database
      //user = await User.createUser({ email, name, role: 'user' }); // Adjust according to your model
      logger.info(`User not found or not active email: ${email} `);
      return res.status(401).json({ message: `User not found or not active ${email}` });
    }

    // Generate your own JWT token
    token = generateToken(user);
    logger.info(`Successful google login for email: ${email} with role: ${user.role}`);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ message: 'Google login failed', error });
  }
};

// Example logout route (JWT-based applications usually handle logout on the client-side)
exports.logout = (req, res) => {
  // No server-side logic for logout in stateless JWT auth, you can clear the token on the client
  res.status(200).json({ message: 'Logged out successfully' });
};
