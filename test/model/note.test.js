const { expect } = require('chai');
const mongoose = require('mongoose');
// importing fake data
const createFakeUser = require('../fakeTestData/createFakeUser');
const fakeNotes = require('../fakeTestData/createFakeNote');
const {
  fixedCreatedAt,
  fixedUpdatedAt,
} = require('../fakeTestData/createFakeDates');

describe('Note Model', async () => {
  let testUser;

  before(async () => {
    testUser = await createFakeUser();
  });

  after(async () => {
    console.log('Cleaning up test data');
    await mongoose.connection.db.collection('notes').deleteMany({});
    await mongoose.connection.db.collection('users').deleteMany({});
    console.log('DB cleanup of note.test complete!');
  });

  it('should create a new note with valid data', async () => {
    const note = await fakeNotes.correctFakeNote(testUser._id);
    expect(note).to.have.property('title').equal('Test Note');
    expect(note).to.have.property('content').equal('This is a test note');
    expect(note.tags).to.include('test', 'note');
    expect(note.user.toString()).to.equal(testUser._id.toString());
    expect(note).to.have.property('createdAt').equal(fixedCreatedAt);
    expect(note).to.have.property('updatedAt').equal(fixedUpdatedAt);
  });

  it('should fail validation when title is missing', async () => {
    const note = await fakeNotes.missingTitleFakeNote(testUser._id);

    const validationError = note.validateSync();
    expect(validationError.errors.title).to.exist;
  });

  it('should fail validation when content is missing', async () => {
    const note = await fakeNotes.missingContentFakeNote(testUser._id);

    const validationError = note.validateSync();
    expect(validationError.errors.content).to.exist;
  });

  it('should use default empty array when category is not provided', async () => {
    const note = await fakeNotes.noTagsGivenFakeNote(testUser._id);
    expect(note).to.have.property('tags').deep.equal([]);
  });
});
