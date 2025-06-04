const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const handleGoogleLogin = require('../../config/passport');
const User = require('../../models/User');
// importing fake data
const UserProfile = require('../../models/UserProfile');

describe('User oAuth', () => {
  let testUser;

  before(async () => {
    // testUser = await createFakeUser();
  });

  afterEach(async () => {
    sinon.restore();
  });

  after(async () => {
    console.log('Cleaning up oauth.test data');
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('userProfiles').deleteMany({});
    console.log('DB cleanup of oauth.test complete!');
  });

  it('should complete first-time login and create a new user', async () => {
    const userProfile = {
      _id: 'userprofile-id',
      displayName: 'Mr oAuth',
    };
    const newUser = {
      googleId: 'profile-id',
      name: {
        firstName: 'Mr',
        lastName: 'oAuth',
      },
      email: 'oAuthTestUser@gmail.com',
      image: null,
      userProfile: userProfile._id,
    };

    const findNoUserStub = sinon.stub(User, 'findOne').resolves(null); // mocks no user found

    const profile = {
      id: 'profile-id',
      name: {
        givenName: 'Mr',
        familyName: 'oAuth',
      },
      emails: [{ value: 'oAuthTestUser@gmail.com' }],
      photos: [{ value: '' }],
      displayName: 'Mr oAuth',
    };
    const createNewUserProfile = sinon
      .stub(UserProfile, 'create')
      .resolves(userProfile);
    const createNewUserStub = sinon.stub(User, 'create').resolves(newUser);

    const done = sinon.spy(); // .spy() mocks a callback fcn

    // should create a new user
    await handleGoogleLogin(null, null, profile, done);
    expect(findNoUserStub.calledOnce).to.be.true;
    expect(createNewUserProfile.calledOnce).to.be.true;
    expect(UserProfile.create.calledWithExactly({ displayName: 'Mr oAuth' })).to
      .be.true;
    expect(createNewUserStub.calledOnce).to.be.true;
    expect(done.calledOnce).to.be.true;
    expect(done.calledWith(null, newUser)).to.be.true;
  });

  it('should update the last login date of an existing user, and any new data from the oAuth provider if new data exists', async () => {
    const existingUserProfile = {
      _id: 'userprofile-id',
      displayName: 'Mr oAuth',
      preferences: {
        theme: 'light',
        primaryColor: '#9b5de5',
        fontSize: '1',
        fontFamily: 'system-ui',
        timeZone: 'UTC',
        dateFormat: 'yyyy-MM-dd',
      },
      lastLogin: new Date('2025-01-01'),
    };

    const existingUser = {
      googleId: 'profile-id',
      name: {
        firstName: 'Mr',
        lastName: 'oAuth',
      },
      email: 'oAuthTestUser@gmail.com',
      image: null,
      userProfile: existingUserProfile._id,
    };

    // lastLogin date for updating existing user login timestamp
    const sinonClock = sinon.useFakeTimers({
      now: new Date('2025-06-02'),
      shouldClearNativeTimers: true,
    });
    const fakeDate = new Date();

    const updatedUserProfile = {
      ...existingUserProfile,
      displayName: 'newGivenName',
      lastLogin: fakeDate,
    };

    const updatedUser = {
      ...existingUser,
      name: {
        firstName: 'newGivenName',
        lastName: 'newFamilyName',
      },
      // email is the same
      image: 'newPhoto.jpg',
    };

    const findUserStub = sinon.stub(User, 'findOne').resolves(existingUser); // finds existing user
    const findUserAndUpdateStub = sinon
      .stub(User, 'findOneAndUpdate')
      .resolves(updatedUser); // updates existing user
    const findProfileAndUpdateStub = sinon
      .stub(UserProfile, 'findOneAndUpdate')
      .resolves(updatedUserProfile); // updates existing profile

    const profile = {
      id: 'profile-id',
      name: {
        givenName: 'newGivenName',
        familyName: 'newFamilyName',
      },
      emails: [{ value: 'oAuthTestUser@gmail.com' }],
      photos: [{ value: 'newPhoto.jpg' }],
      displayName: 'newGivenName',
      preferences: {
        theme: 'light',
        primaryColor: '#FFFFFF',
        fontSize: '3',
        fontFamily: 'Roboto',
        timeZone: 'UTC',
        dateFormat: 'LLLL d, yyyy',
      },
      lastLogin: fakeDate,
    };

    const done = sinon.spy();

    await handleGoogleLogin(null, null, profile, done);

    expect(findUserStub.calledOnce).to.be.true;
    expect(findUserAndUpdateStub.calledOnce).to.be.true;
    expect(findProfileAndUpdateStub.calledOnce).to.be.true;

    // data passed to User.findOneAndUpdate
    expect(
      findUserAndUpdateStub.calledWithMatch(
        { googleId: 'profile-id' },
        {
          $set: {
            name: {
              firstName: 'newGivenName',
              lastName: 'newFamilyName',
            },
            email: 'oAuthTestUser@gmail.com',
            image: 'newPhoto.jpg',
          },
        }
      )
    ).to.be.true;

    // data returned to userProfile fields
    const returnedUpdatedUserProfileValues =
      findProfileAndUpdateStub.getCall(0).args[1];
    expect(returnedUpdatedUserProfileValues.$set.displayName).to.equal(
      'newGivenName'
    );
    expect(returnedUpdatedUserProfileValues.$set.lastLogin.getTime()).to.equal(
      fakeDate.getTime()
    );

    // data passed to User.findOneAndUpdate
    expect(
      findProfileAndUpdateStub.calledWithMatch(
        { _id: 'userprofile-id' },
        {
          $set: {
            displayName: 'newGivenName',
            lastLogin: fakeDate,
          },
        }
      )
    );

    // data returned to user fields
    const returnedUpdatedUserValues = done.getCall(0).args[1];
    expect(returnedUpdatedUserValues.name.firstName).to.equal('newGivenName');
    expect(returnedUpdatedUserValues.name.lastName).to.equal('newFamilyName');
    expect(returnedUpdatedUserValues.email).to.equal('oAuthTestUser@gmail.com'); // email was the same
    expect(returnedUpdatedUserValues.image).to.equal('newPhoto.jpg');

    expect(done.calledOnce).to.be.true;
    expect(done.calledWith(null, updatedUser)).to.be.true;

    sinonClock.restore();
  });

  // no test for logout since it is 100% based on passport
});
