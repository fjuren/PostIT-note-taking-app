const Note = require('../models/Note');

// /notes
// Gets all user notes
const getAllUserNotes = async (userId) => {
  return await Note.find({ user: userId }).sort({ updatedAt: 'desc' });
};

// notes
// Gets all filtered notes
const getFileredNotes = async (userId, filters) => {
  return await Note.find({ user: userId }).where('tags').in(filters);
};

// // /notes
// // Creates a new note
const createNote = async (title, content, userId, tagValues) => {
  return await Note.create({
    title,
    content,
    user: userId,
    tags: tagValues,
  });
};

// // /notes/:id
// // Get a single note for editing
const getUserNote = async (noteId) => {
  return await Note.findById(noteId);
};

// // /notes/id
// // Update a note
const updateNote = async (noteId, title, content, tagValues) => {
  let note = await Note.findById(noteId);
  note = await Note.findOneAndUpdate(
    { _id: noteId },
    {
      title,
      content,
      tags: tagValues,
      updateAt: Date.now(),
    },
    { new: true }
  );
  return note;
};

// // notes/:id
// // Delete a note
const deleteNote = async (noteId) => {
  let note = await Note.findById(noteId);
  note = await Note.deleteOne({ _id: noteId });
  return note;
};

// notes/tags
// get tags from notes
const getAllNoteTags = async (userId) => {
  const notes = await Note.find({ user: userId }).select('tags');
  const allTags = notes.flatMap((note) => note.tags);
  const uniqueTags = [...new Set(allTags)]; // only add unique tags to final array
  return uniqueTags;
};

module.exports = {
  getAllUserNotes,
  getFileredNotes,
  createNote,
  getUserNote,
  updateNote,
  deleteNote,
  getAllNoteTags,
};
