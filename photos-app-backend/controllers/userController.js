// controllers/userController.js
//testowa -- zwraca wszystkich userów
const pool = require('../config/db');
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM User');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//rejestracja
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Sprawdzenie, czy wszystkie wymagane pola są obecne
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    // Sprawdzenie, czy taki użytkownik lub email już istnieje
    const [existingUser] = await pool.query(
      'SELECT * FROM User WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already taken.' });
    }

    // Hashowanie hasła
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Wstawienie nowego użytkownika do bazy
    await pool.query(
      'INSERT INTO User (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 'user']
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

//logowanie
const jwt = require('jsonwebtoken');
// ...
exports.loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Please provide username/email and password.' });
    }

    // Szukamy użytkownika po username lub email
    const [rows] = await pool.query(
      'SELECT * FROM User WHERE username = ? OR email = ? LIMIT 1',
      [usernameOrEmail, usernameOrEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    // Porównanie hasła z hashem w bazie
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Tworzenie ładunku (payload) do tokenu
    const payload = {
      userId: user.user_id,
      username: user.username,
      role: user.role
    };

    // Generowanie tokenu (np. ważny przez 2h)
    // Klucz SECRET najlepiej trzymać w .env
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '2h'
    });

    res.json({
      message: 'Logged in successfully.',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
