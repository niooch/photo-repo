const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { verifyToken } = require('../controllers/authMiddleware');

// Tworzenie nowego albumu (POST /api/albums)
router.post('/', verifyToken, albumController.createAlbum);

// Pobieranie listy albumów (GET /api/albums)
// Dla użytkownika zwykłego – tylko swoje, dla admina – wszystkie
router.get('/', verifyToken, albumController.getAlbums);

// Pobieranie szczegółów albumu (GET /api/albums/:albumId)
// Zwracane zostaną dane albumu oraz zdjęcia w albumie
router.get('/:albumId', verifyToken, albumController.getAlbumDetails);

// Dodawanie zdjęcia do albumu (POST /api/albums/:albumId/photos/:photoId)
router.post('/:albumId/photos/:photoId', verifyToken, albumController.addPhotoToAlbum);


module.exports = router;
