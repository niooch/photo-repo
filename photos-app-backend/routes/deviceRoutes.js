const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { verifyToken } = require('../controllers/authMiddleware');

// Tworzenie nowego urządzenia (POST /api/devices)
router.post('/', verifyToken, deviceController.createDevice);

// Inne trasy, np. pobieranie urządzeń
router.get('/', verifyToken, deviceController.getDevices);

module.exports = router;
