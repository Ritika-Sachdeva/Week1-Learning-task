const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, notesController.createNote);
router.get('/', authMiddleware, notesController.getNotes);
router.put('/:id', authMiddleware, notesController.updateNote);
router.delete('/:id', authMiddleware, notesController.deleteNote);

module.exports = router;