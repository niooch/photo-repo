// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/authMiddleware');

//testowe -- zwroc wszystkich uzytkownikow
router.get('/test-db', userController.getAllUsers);

//trasa do rejestracji uzytkownika
router.post('/register', userController.registerUser);

//trasa do logowania uzytkownika
router.post('/login', userController.loginUser);

/* -------------------------- zalogowany uzytkownik -------------------------- */
router.get('/profile', verifyToken, (req, res) => {
  // req.user tu jest obiektem z tokenu
  return res.json({ message: 'Welcome to your profile!', user: req.user });
});

//statystyki uzytkownika
router.get('/:userId/stats', verifyToken, userController.getUserStats);

//dane uzytkownika
router.get('/me', verifyToken, userController.getLoggedUser);

module.exports = router;
