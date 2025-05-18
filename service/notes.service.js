const Note = require('../models/Note');

// /notes
// Gets all user notes
const getAllUserNotes = async (user) => {
    return await Note.find({ user }).sort({ updatedAt: 'desc' });
}

// // /notes
// // Creates a new note
const createNote = async (title, content, user, tagValues) => {
    return await Note.create({
      title,
      content,
      user,
      tag: tagValues
    });
}

// // /notes/:id
// // Get a single note for editing
const getUserNote = async (user) => {
    return await Note.findById(user);
}

// // /notes/id
// // Update a note
const updateNote = async (user, title, content) => {
    let note = await Note.findById(user)
    note = await Note.findOneAndUpdate( 
        {_id: user},
        {
            title,
            content,
            updateAt: Date.now()
        },
        { new: true }
    )
    return note
}

// // notes/:id
// // Delete a note
const deleteNote = async (user) => {
    let note = await Note.findById(user)
    note = await Note.deleteOne({ _id: user });
    return note
}

module.exports = {
  getAllUserNotes,
  createNote,
  getUserNote,
  updateNote,
  deleteNote
};