// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Przykładowa trasa - pobranie wszystkich użytkowników
router.get('/', userController.getAllUsers);

// Dodajemy kolejne (rejestracja, logowanie itp.)
// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);

module.exports = router;
