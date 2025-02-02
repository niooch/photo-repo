const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authMiddleware');
const photoController = require('../controllers/photoController');
const upload = require('../config/multerConfig');

// CREATE: upload zdjęcia
router.post('/', verifyToken, upload.array('photos', 10), photoController.createPhotos);

// GET list of photos (admin -> all, user -> only own, or all public? - zależnie od Twoich potrzeb)
router.get('/', verifyToken, photoController.getPhotos);

// GET publiczne zdjecia
router.get('/public', photoController.getPublicPhotos);

// GET by id
router.get('/:photoId', verifyToken, photoController.getPhotoById);

// UPDATE
router.put('/:photoId', verifyToken, photoController.updatePhoto);

// DELETE
router.delete('/:photoId', verifyToken, photoController.deletePhoto);

// SET czy public
router.put('/:photoId/public', verifyToken, photoController.setPhotoPublic);

// Dodawanie tagu do zdjęcia
// Endpoint: POST /api/photos/:photoId/tags
router.post('/:photoId/tags', verifyToken, photoController.addTagToPhoto);

// Usuwanie tagu ze zdjęcia
// Endpoint: DELETE /api/photos/:photoId/tags/:tagId
router.delete('/:photoId/tags/:tagId', verifyToken, photoController.removeTagFromPhoto);

// Aktualizacja urządzenia przypisanego do zdjęcia
router.put('/:photoId/device', verifyToken, photoController.updatePhotoDevice);





module.exports = router;
