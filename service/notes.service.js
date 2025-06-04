const Note = require('../models/Note');
const miscHelpers = require('../utils/misc');

// /notes
// Gets all user notes
const getAllUserNotes = async (user) => {
  const originalNotes = await Note.find({ user: user.id }).sort({
    updatedAt: 'desc',
  });
  // apply formatting to date based on user preference
  const notes = originalNotes.map((note) => ({
    ...(note.toObject?.() ?? note),
    updatedAt: miscHelpers.formatDateWithPreferences(
      user.userProfile,
      note.updatedAt
    ),
  }));
  return notes;
};

// notes
// Gets all filtered notes
const getFileredNotes = async (user, filters) => {
  const originalNotes = await Note.find({ user: user.id })
    .where('tags')
    .in(filters);
  const notes = originalNotes.map((note) => ({
    ...(note.toObject?.() ?? note),
    updatedAt: miscHelpers.formatDateWithPreferences(
      user.userProfile,
      note.updatedAt
    ),
  }));
  return notes;
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
  await Note.deleteOne({ _id: noteId });
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
