process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const http = require('http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

// setting up global settings
global.chai = chai;
global.expect = expect;
global.app = http.createServer(app);

console.log('Starting tests setup');

before(async () => {
  console.log('Connecting to test DB...');
  await mongoose.connect(process.env.MONGODB_TEST_URI); // using test db wtihin mongo cluster
});

after(async () => {
  console.log('Disconnecting from test DB...');
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
