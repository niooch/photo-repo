const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { verifyToken, isAdmin } = require('../controllers/authMiddleware');

// CREATE: Dodawanie nowego urządzenia (dla zalogowanego użytkownika)
router.post('/', verifyToken, deviceController.createDevice);

// READ: Pobranie wszystkich urządzeń (admin), lub tylko swoich (user)
router.get('/', verifyToken, deviceController.getDevices);

// READ (by id): Pobranie konkretnego urządzenia
router.get('/:deviceId', verifyToken, deviceController.getDeviceById);

// UPDATE: Edycja własnego urządzenia (lub dowolnego, jeśli admin)
router.put('/:deviceId', verifyToken, deviceController.updateDevice);

// DELETE: Usunięcie własnego urządzenia (lub dowolnego, jeśli admin)
router.delete('/:deviceId', verifyToken, deviceController.deleteDevice);

module.exports = router;
