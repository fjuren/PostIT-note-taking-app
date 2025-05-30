process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

// setting up global settings
global.chai = chai;
global.expect = expect;
global.app = require('../app');

console.log('Starting tests setup');
