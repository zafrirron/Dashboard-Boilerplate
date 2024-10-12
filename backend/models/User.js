// backend/models/User.js
const pool = require('../config/db');  // Assuming you've configured your database connection in db.js

const User = {
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];  // Assuming you're using PostgreSQL
  },
};

module.exports = User;
