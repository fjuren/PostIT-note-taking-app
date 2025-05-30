const chai = require('chai');
const { expect } = chai;
const app = require('../../app');
const Note = require('../../models/Note');
const fakeNotes = require('../fakeTestData/createFakeNote');
const createFakeUser = require('../fakeTestData/createFakeUser');

describe('Notes API - GET Endpoints', () => {
  let testUser;

  before(async () => {
    testUser = await createFakeUser();
  });

  it('should get all notes for a user', (done) => {
    fakeNotes
      .correctFakeNote(testUser._id)
      .then(() => {
        chai
          .request(app)
          .get('/notes')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            expect(res.text).to.include('Test Note');
            expect(res.text).to.include('This is a test note');
            // expect(res.text).to.include(testUser.userProfile.displayName);
            done();
          });
      })
      .catch(done);
  });

  //   // Exercise: Add a test for getting a specific note by ID
  //   it('should get a specific note by ID', (done) => {
  //     // TODO: First create a test note, then fetch it by ID
  //     // Verify the returned note has the expected properties
  //     // Hint: You'll need to make two requests - one to create, one to fetch
  //   });

  //   // Exercise: Add a test for getting notes filtered by category
  //   it('should get notes filtered by category', (done) => {
  //     // TODO: Test the endpoint that filters notes by category
  //     // Verify only notes with the specified category are returned
  //     // Ask for help if this does not make sense
  //   });

  // After each test, clean up. Do not leave growing users in your db.
  afterEach(() => {
    // delete app.request.user;
  });
});
