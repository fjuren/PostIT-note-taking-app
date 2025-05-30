const Note = require('../../models/Note');
const { fixedCreatedAt, fixedUpdatedAt } = require('./createFakeDates');

async function correctFakeNote(userId) {
  return await Note.create({
    title: 'Test Note',
    content: 'This is a test note',
    tags: ['test', 'note'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  });
}

async function missingTitleFakeNote(userId) {
  return new Note({
    title: '', // invalid title error
    content: 'This is a test note',
    tags: ['test', 'note'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  });
}

async function missingContentFakeNote(userId) {
  return new Note({
    title: 'Title goes here',
    content: '', // invalid content error
    tags: ['test', 'note'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  });
}

async function noTagsGivenFakeNote(userId) {
  return new Note({
    title: 'Title goes here',
    content: '',
    // no tags provided
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  });
}

module.exports = {
  correctFakeNote,
  missingTitleFakeNote,
  missingContentFakeNote,
  noTagsGivenFakeNote,
};
