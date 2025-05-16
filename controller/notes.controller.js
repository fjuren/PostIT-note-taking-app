const noteService = require('../service/notes.service')

// /notes
// Gets all user notes
const getAllUserNotes = async (req, res) => {
  try {
    const user = req.user.id
    const notes = await noteService.getAllUserNotes(user)
    res.render('notes', {
        user,
        notes
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// // /notes
// // Creates a new note
const createNote = async(req, res) => {
    try {
        const { title, content} = req.body;
        const user = req.user.id
        // console.log('title', title, 'content', content, 'user', user)
        await noteService.createNote(title, content, user)
        res.redirect('/notes')
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// // /notes/:id
// // Get a single note for editing
const getUserNote = async (req, res) => {
  try {
    const user = req.params.id
    const note = await noteService.getUserNote(user);
    
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
};

// // /notes/id
// // Update a note
const updateNote = async (req, res) => {
  try {
    const user = req.params.id
    const title = req.body.title
    const content = req.body.content
    const note = await noteService.updateNote(user, title, content)
    
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
    const user = req.params.id
    let note = await noteService.deleteNote(user);
    
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

module.exports = {
  getAllUserNotes,
  createNote,
  getUserNote,
  updateNote,
  deleteNote
};