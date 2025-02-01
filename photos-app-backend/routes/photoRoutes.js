const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authMiddleware');
const photoController = require('../controllers/photoController');
const upload = require('../config/multerConfig');

// CREATE: upload zdjęcia
router.post('/', verifyToken, upload.single('photo'), photoController.createPhoto);

// GET list of photos (admin -> all, user -> only own, or all public? - zależnie od Twoich potrzeb)
router.get('/', verifyToken, photoController.getPhotos);

// GET by id
router.get('/:photoId', verifyToken, photoController.getPhotoById);

// UPDATE
router.put('/:photoId', verifyToken, photoController.updatePhoto);

// DELETE
router.delete('/:photoId', verifyToken, photoController.deletePhoto);

module.exports = router;
