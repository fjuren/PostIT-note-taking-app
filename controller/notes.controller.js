const noteService = require('../service/notes.service');
const miscHelpers = require('../utils/misc');

// /notes
// Gets all user notes, includes filtering by tag categories
const getAllUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const filters = req.query.filter;
    const tags = await noteService.getAllNoteTags(userId);
    if (!filters) {
      // all notes
      const notes = await noteService.getAllUserNotes(userId);
      res.render('notes', {
        user,
        notes,
        tags,
        filters: [], // handles case where no filtesr are applied but still defines filters
      });
    } else {
      // filtered notes
      const notes = await noteService.getFileredNotes(userId, filters);
      res.render('notes', {
        user,
        notes,
        tags,
        filters,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// /notes/create
// renders the note creation page
const renderCreateNotePage = (req, res) => {
  res.render('notes/create', { user: req.user });
};

// // /notes
// // Creates a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const rawTags = req.body['input-custom-dropdown'];
    const tagValues = miscHelpers.getTagValues(rawTags);
    const userId = req.user.id;
    await noteService.createNote(title, content, userId, tagValues);
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// // /notes/:id
// // Get a single note for editing
const getUserNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await noteService.getUserNote(noteId);
    const user = req.user;
    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }

    // Check who owns the notes; ensure it's the note author/user
    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }

    res.render('notes/edit', {
      user,
      note,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
};

// // /notes/id
// // Update a note
const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    const rawTags = req.body['input-custom-dropdown'];
    const tagValues = miscHelpers.getTagValues(rawTags);
    const note = await noteService.updateNote(
      noteId,
      title,
      content,
      tagValues
    );

    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }

    // Check who owns the notes; ensure it's the note author/user

    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }

    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
};

// // notes/:id
// // Delete a note
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    let note = await noteService.deleteNote(noteId);

    // Check if note exists
    if (!note) {
      return res.redirect('/notes');
    }

    // Check who owns the notes; ensure it's the note author/user
    if (note.user.toString() !== req.user.id) {
      return res.redirect('/notes');
    }
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.redirect('/notes');
  }
};

// notes/tags
// get tags from notes
const getAllNoteTags = async (req, res) => {
  try {
    const userId = req.user.id;
    const uniqueTags = await noteService.getAllNoteTags(userId);
    res.json(uniqueTags);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAllUserNotes,
  renderCreateNotePage,
  createNote,
  // filterNotesByTag,
  getUserNote,
  updateNote,
  deleteNote,
  getAllNoteTags,
};
