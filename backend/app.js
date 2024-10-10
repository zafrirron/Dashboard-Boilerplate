// backend/app.js
const express = require('express');
const pool = require('./db');  // Import the database connection
const app = express();
const PORT = process.env.PORT || 5000;

// Get data from the database
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Data fetched successfully', data: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
