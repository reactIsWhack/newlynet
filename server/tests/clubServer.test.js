const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const getSchool = require('../services/schoolService');
const { createTestUser, loginUser } = require('./userHelper');
const { app } = require('../socket/socket');
const { shuffledInterests } = require('../utils/seeds');
const ioc = require('socket.io-client');
const User = require('../models/user.model');
const ClubServer = require('../models/clubServer.model');

let jwt;
let userInfo;
let clubServerId;
let clientSocket;
let secondUserSocket;
let secondUserToken;

beforeAll(async () => {
  await initializeMongoDB();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  const secondUser = await User.findOne({
    'school.schoolId': user.school.schoolId,
  });
  const secondUserData = await loginUser(
    secondUser.username,
    process.env.FAKE_USER_PASSWORD
  );
  secondUserToken = secondUserData.token;

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id },
  });

  secondUserSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: secondUser._id },
  });
});

describe('GET /clubserver', () => {
  it('Should get the club server for the princeton user', async () => {
    const response = await request(app)
      .get('/api/clubserver')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    clubServerId = response.body._id;
    console.log(response.body);
    expect(response.body.schoolAffiliation).toBe(userInfo.school.schoolId);
    expect(response.body.chats[0].chatTopic).toBe(shuffledInterests[0]);
  });
});

describe('PATCH /clubserver', () => {
  it('Should have the user join their club server', async () => {
    const joinPromise = new Promise((resolve) => {
      secondUserSocket.on('clubServerJoin', (clubServer, newUser) => {
        resolve({ clubServer, newUser });
      });
    });

    const response = await request(app)
      .patch(`/api/clubserver/${clubServerId}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.members[0]._id.toString()).toBe(
      userInfo._id.toString()
    );

    const joinEvent = await joinPromise;
    expect(joinEvent.clubServer.members[0]._id.toString()).toBe(
      userInfo._id.toString()
    );
    expect(joinEvent.newUser._id.toString()).toBe(userInfo._id.toString());
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  secondUserSocket.disconnect();
  await disconnectMongoDB();
});
