const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { verifyToken, isAdmin } = require('../controllers/authMiddleware');

// CREATE
router.post('/', verifyToken, isAdmin, tagController.createTag);
// READ
router.get('/', verifyToken, tagController.getAllTags);
router.get('/:tagId', verifyToken, tagController.getTagById);
// UPDATE
router.put('/:tagId', verifyToken, isAdmin, tagController.updateTag);
// DELETE
router.delete('/:tagId', verifyToken, isAdmin, tagController.deleteTag);

module.exports = router;
