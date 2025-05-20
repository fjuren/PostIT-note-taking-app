const Note = require('../models/Note');

// /notes
// Gets all user notes
const getAllUserNotes = async (user) => {
    return await Note.find({ user }).sort({ updatedAt: 'desc' });
}

// notes
// Gets all filtered notes
const getFileredNotes = async (user, filters) => {
    return await Note.find({user}).where('tags').in(filters);
}

// // /notes
// // Creates a new note
const createNote = async (title, content, user, tagValues) => {
    return await Note.create({
      title,
      content,
      user,
      tags: tagValues
    });
}

// // /notes/:id
// // Get a single note for editing
const getUserNote = async (user) => {
    return await Note.findById(user);
}

// // /notes/id
// // Update a note
const updateNote = async (user, title, content, tagValues) => {
    let note = await Note.findById(user)
    note = await Note.findOneAndUpdate( 
        {_id: user},
        {
            title,
            content,
            tags: tagValues,
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

// notes/tags
// get tags from notes
const getAllNoteTags = async (user) => {
    const notes = await Note.find({ user }).select('tags');
    const allTags = notes.flatMap(note => note.tags);
    const uniqueTags = [...new Set(allTags)]; // only add unique tags to final array
    return uniqueTags
}

module.exports = {
  getAllUserNotes,
  getFileredNotes,
  createNote,
  getUserNote,
  updateNote,
  deleteNote,
  getAllNoteTags
};