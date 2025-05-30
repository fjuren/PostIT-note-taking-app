const { expect } = require('chai');
const mongoose = require('mongoose');
const Note = require('../../models/Note');
const User = require('../../models/User');
const UserProfile = require('../../models/UserProfile');
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
    console.log('connecting to test db and setting up data');
    await mongoose.connect(process.env.MONGODB_TEST_URI); // using test db wtihin mongo cluster
    testUser = await createFakeUser();
    console.log('testing starting');
  });

  after(async () => {
    console.log('Cleaning up test data');
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    console.log('testing complete');
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
    // TODO: Create a note without content and verify validation fails
  });

  it('should use default empty string when category is not provided', async () => {
    // TODO: Create a note without specifying category and verify it defaults to empty string
  });
});
