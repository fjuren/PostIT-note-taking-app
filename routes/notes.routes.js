const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const notesController = require('../controller/notes.controller');

// /notes
// Gets all user notes, includes filtering by tag categories
router.get('/', ensureAuth, notesController.getAllUserNotes);

// notes/tags
// get tags from notes
router.get('/tags', ensureAuth, notesController.getAllNoteTags)

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
router.delete('/delete/:id', ensureAuth, notesController.deleteNote)


module.exports = router;