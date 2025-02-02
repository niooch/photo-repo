// app.js
const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
//routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const photoRoutes = require('./routes/photoRoutes');
const albumRoutes = require('./routes/albumRoutes');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/albums', albumRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// test DB
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ dbTestResult: rows[0].result });
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    });
