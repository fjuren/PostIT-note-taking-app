const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const app = require('../../app');
const fakeNotes = require('../fakeTestData/createFakeNote');
const createFakeUser = require('../fakeTestData/createFakeUser');
const createFakeUserProfile = require('../fakeTestData/createFakeUserProfile');

describe('Notes API - GET Endpoints', () => {
  let testUser;

  // create fake user and their fake user profile
  before(async () => {
    testUser = await createFakeUser();
    testUserProfile = await createFakeUserProfile();
  });

  // delete fake user & notes
  afterEach(() => {
    delete app.request.user;
    delete app.request.note;
  });

  after(async () => {
    console.log('Cleaning up note-get.test data');
    await mongoose.connection.db.collection('notes').deleteMany({});
    await mongoose.connection.db.collection('users').deleteMany({});
    console.log('DB cleanup of note-get.test complete!');
  });

  it('should get all notes for a user', async () => {
    await fakeNotes.noTagsGivenFakeNote(testUser._id);
    await fakeNotes.correctFakeNote(testUser._id);
    const res = await chai.request(app).get('/notes');
    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res.text).to.include('Test Note');
    expect(res.text).to.include('This is a test note');
    expect(res.text).to.include('Title of no tags note');
    expect(res.text).to.include(testUserProfile.displayName);
  });

  it('should get notes filtered by category', async () => {
    const note1 = await fakeNotes.correctFakeNote(testUser._id); // contains jumanji tag
    const note2 = await fakeNotes.correctFakeNote2(testUser._id); // contains jumanji tag
    const note3 = await fakeNotes.correctFakeNote3(testUser._id); // doesn't contain jumanji tag
    const res = await chai.request(app).get('/notes?filter=jumanji');
    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res.text).to.include(note1._id);
    expect(res.text).to.include(note2._id);
    expect(res.text).to.not.include(note3._id);
  });

  // gets correct tags per note

  it('should get a specific note by ID', async () => {
    const note = await fakeNotes.correctFakeNote(testUser._id);
    const res = await chai.request(app).get(`/notes/${note._id}`);
    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res.text).to.include('Test Note');
    expect(res.text).to.include('This is a test note');
    expect(res.text).to.include('tags');
    expect(res.text).to.include('value="test,note,jumanji,school"'); // tag values
    expect(res.text).to.include(testUserProfile.displayName);
    // updatedAt and createdAt fields don't exist when calling note by ID and rendering the server-rendered html (ejs)
  });
});
