// testdb.js
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ dbTestResult: rows[0].result });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
