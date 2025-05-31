const Note = require('../../models/Note');
const { fixedCreatedAt, fixedUpdatedAt } = require('./createFakeDates');

async function correctFakeNote(userId) {
  return await Note.create({
    title: 'Test Note',
    content: 'This is a test note',
    tags: ['Test', 'note', 'jumanji', 'school'].map(t => t.toLowerCase()), // recall that post request to /notes sets all tags to lower case prior to creating notes. Mocking that here
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
  }) // not adding .save() since that will evoke mongo validation missing field error
}

async function missingContentFakeNote(userId) {
  return new Note({
    title: 'Title goes here',
    content: '', // invalid content error
    tags: ['test', 'note'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  }) // not adding .save() since that will evoke mongo validation missing field error
}

async function noTagsGivenFakeNote(userId) {
  return new Note({
    title: 'Title of no tags note',
    content: 'Tags are not needed to this note',
    // no tags provided
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  }).save()
}

async function correctFakeNote2(userId) {
  return new Note({
    title: 'Second fake note',
    content: 'Content for second note',
    tags: ['school', 'jumanji'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  }).save()
}


  async function correctFakeNote3(userId) {
  return new Note({
    title: 'Third fake note',
    content: 'Content for third note',
    tags: ['test', 'note'],
    user: userId,
    createdAt: fixedCreatedAt,
    updatedAt: fixedUpdatedAt,
  }).save()
}

module.exports = {
  correctFakeNote,
  missingTitleFakeNote,
  missingContentFakeNote,
  noTagsGivenFakeNote,
  correctFakeNote2,
  correctFakeNote3
};
