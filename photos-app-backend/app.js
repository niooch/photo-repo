// app.js
const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Przykładowe trasy
app.use('/api/users', userRoutes);

// test DB
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
  console.log(`Server is running on port ${PORT}`);
});
