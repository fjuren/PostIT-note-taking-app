const chai = require('chai');
const mongoose = require('mongoose');
const { expect } = chai;
const app = require('../../app');
const createFakeUser = require('../fakeTestData/createFakeUser');

describe('Notes API - POST Endpoint', function() {
  let testUser;

  beforeEach(async () => {
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('notes').deleteMany({});
    testUser = await createFakeUser();
  });

    afterEach(async () => {
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.connection.db.collection('notes').deleteMany({});
    });

  it('should create a new note with valid data', async () => {
  const newNote = {
    title: 'New Test Note',
    content: 'This is a test note created via API',
    'input-custom-dropdown': JSON.stringify([{ value: 'API Testing' }, {value: 'school'}]), // tag
    user: testUser._id,
  };
   
    const res = await chai.request(app)
    .post('/notes')
    .redirects(0) // prevent chai default redirects to 200; api redirects and uses status code 303 
    .send(newNote)
    expect(res).to.have.status(303);
    expect(res).to.redirectTo(/\/notes$/);
    const getNotesPage = await chai.request(app).get('/notes');
    expect(getNotesPage.text).to.include('New Test Note') // title
    expect(getNotesPage.text).to.include('This is a test note created via API') // content
    expect(getNotesPage.text).to.include('api testing') // tag (note creation should lower case all tags)
    expect(getNotesPage.text).to.include('school') // tag
  });
  
  it('should return 400 when creating a note without required fields', async () => {
    const newNote = {
        title: '',
        content: '',
        user: testUser._id,
    };

    const res = await chai.request(app).post('/notes').send(newNote)
    expect(res).to.have.status(400)
    expect(res.body).to.have.property('message').equal('Validation failed')
    expect(res.body.errors).to.deep.include.members([
        { field: 'title', message: 'Path `title` is required.' },
        { field: 'content', message: 'Path `content` is required.' }
    ])
  });
});
