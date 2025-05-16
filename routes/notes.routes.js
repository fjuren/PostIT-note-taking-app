const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Note = require('../models/Note');
const notesController = require('../controller/notes.controller');

// /notes
// Gets all user notes
router.get('/', ensureAuth, notesController.getAllUserNotes);

// /notes
// Creates a new note
router.post('/', ensureAuth, notesController.createNote) 

// /notes/:id
// Get a single note for editing
router.get('/:id', ensureAuth, notesController.getUserNote)

// /notes/id
// Update a note
router.put('/:id', ensureAuth, notesController.updateNote)

// notes/:id
// Delete a note
router.delete('/:id', ensureAuth, notesController.deleteNote)

module.exports = router;