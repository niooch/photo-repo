// controllers/userController.js
const pool = require('../config/db');

// np. pobranie listy użytkowników
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM User');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// rejestracja użytkownika
exports.registerUser = async (req, res) => {
  // ...
};

// logowanie użytkownika
exports.loginUser = async (req, res) => {
  // ...
};
