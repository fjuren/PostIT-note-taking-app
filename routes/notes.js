const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Note = require('../models/Note');

// /notes
// Gets all user notes
router.get('/', ensureAuth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: 'desc' });
    res.render('notes', {
      user: req.user,
      notes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// /notes
// Creates a new note
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    await Note.create({
      title,
      content,
      user: req.user.id
    });
    
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// /notes/:id
// Get a single note for editing
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }
    
    // Check who owns the notes; ensure it's the note author/user
    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }
    
    res.render('notes/edit', {
      user: req.user,
      note
    });
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
});

// /notes/id
// Update a note
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }
    
    // Check who owns the notes; ensure it's the note author/user

    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }
    
    // Update a note
    note = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { 
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
});

// notes/:id
// Delete a note
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }
    
    // Check who owns the notes; ensure it's the note author/user
    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }
    
    await Note.deleteOne({ _id: req.params.id });
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
});

module.exports = router;