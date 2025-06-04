const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [1, 'Your note needs a title'],
    maxLength: [200, 'Title cannot exceed 200 characters'],
    required: true,
    trim: true,
  },
  content: {
    type: String,
    minLength: [1, 'Your note needs some content'],
    maxLength: [10000, 'Content cannot exceed 10,000 characters'],
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', NoteSchema);
