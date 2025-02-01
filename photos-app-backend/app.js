// app.js
const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
//routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const photoRoutes = require('./routes/photoRoutes');
const tagRoutes = require('./routes/tagRoutes');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/albums', albumRoutes);


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
