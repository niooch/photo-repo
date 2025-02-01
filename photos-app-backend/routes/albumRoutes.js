const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { verifyToken } = require('../controllers/authMiddleware');

// CREATE
router.post('/', verifyToken, albumController.createAlbum);
// READ
router.get('/', verifyToken, albumController.getAlbums);
router.get('/:albumId', verifyToken, albumController.getAlbumById);
// UPDATE
router.put('/:albumId', verifyToken, albumController.updateAlbum);
// DELETE
router.delete('/:albumId', verifyToken, albumController.deleteAlbum);

// Dodanie zdjęcia do albumu
router.post('/:albumId/photos/:photoId', verifyToken, albumController.addPhotoToAlbum);
// Usunięcie zdjęcia z albumu
router.delete('/:albumId/photos/:photoId', verifyToken, albumController.removePhotoFromAlbum);

module.exports = router;
