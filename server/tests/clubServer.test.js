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
let usersToInvite = [];
let customServerId;

beforeAll(async () => {
  await initializeMongoDB();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  const [secondUser, thirdUser] = await User.find({
    'school.schoolId': user.school.schoolId,
    _id: { $ne: user._id },
  });
  usersToInvite = [secondUser._id, thirdUser._id];
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

describe('POST /clubserver', () => {
  it('Should create a new custom club server', async () => {
    const response = await request(app)
      .post('/api/clubserver')
      .set('Cookie', [...jwt])
      .send({ serverName: 'Test Server', tags: ['Computer Science'] })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    customServerId = response.body._id;
    expect(response.body.chats[0].chatTopic).toBe('General');
    expect(response.body.schoolAffiliation).toBe(userInfo.school.schoolId);
    expect(response.body.serverName).toBe('Test Server');
    expect(response.body.tags.length).toBe(1);
    expect(response.body.tags).toContain('Computer Science');
    expect(response.body.members.map((m) => String(m._id))).toEqual(
      expect.arrayContaining([String(userInfo._id)])
    );
  });

  it('Should fail to create an existing club server', async () => {
    const response = await request(app)
      .post('/api/clubserver')
      .set('Cookie', [...jwt])
      .send({ serverName: 'Test Server', tags: ['Computer Science'] })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Server name already exists');
  });
});

describe('GET /clubserver', () => {
  beforeAll(async () => {
    await Promise.all([
      ClubServer.create({
        custom: true,
        chats: [],
        tags: ['art'],
        members: [],
        serverName: 'Test Server 2.0',
        schoolAffiliation: userInfo.school.schoolId,
      }),
      ClubServer.create({
        custom: true,
        chats: [],
        tags: ['Social'],
        members: [],
        serverName: 'Test Server 3.0',
        schoolAffiliation: userInfo.school.schoolId,
      }),
    ]);
  });

  it('Should get the club server for the princeton user', async () => {
    const response = await request(app)
      .get('/api/clubserver')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    clubServerId = response.body._id;
    expect(response.body.schoolAffiliation).toBe(userInfo.school.schoolId);
    expect(response.body.chats[0].chatTopic).toBe(shuffledInterests[0]);
  });

  it('Should get the custom club servers a user is part of', async () => {
    const response = await request(app)
      .get('/api/clubserver/allservers')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.length).toBe(1);
    expect(response.body[0].chats.length).toBe(1);
    expect(response.body[0].members[0]._id.toString()).toBe(
      userInfo._id.toString()
    );
  });

  it('Should get the suggested server for the test user', async () => {
    const response = await request(app)
      .get('/api/clubserver/suggestedservers')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.length).toBe(2);
    expect(response.body[0].serverName).toBe('Test Server 2.0');
    expect(response.body[1].serverName).toBe('Test Server 3.0');
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

  it('Should send club server invites to a user', async () => {
    const response = await request(app)
      .patch(`/api/clubserver/invite/${customServerId}/${usersToInvite[0]._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const secondUserUpdated = await User.findById(
      usersToInvite[0]._id
    ).populate({ path: 'serverInvites', populate: ['server', 'sender'] });
    expect(response.body.serverInvites.length).toBe(1);
    expect(secondUserUpdated.serverInvites[0].server._id.toString()).toBe(
      customServerId.toString()
    );
    expect(secondUserUpdated.serverInvites[0].sender._id.toString()).toBe(
      userInfo._id.toString()
    );
  });

  it("Should update the second user's server invites when they join", async () => {
    const response = await request(app)
      .patch(`/api/clubserver/${customServerId}`)
      .set('Cookie', [...secondUserToken])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const secondUserUpdated = await User.findById(usersToInvite[0]._id);
    expect(response.body.members.length).toBe(2);
    expect(response.body.members.map((m) => String(m._id))).toEqual(
      expect.arrayContaining([
        String(userInfo._id),
        String(secondUserUpdated._id),
      ])
    );
    expect(secondUserUpdated.serverInvites.length).toBe(0);
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  secondUserSocket.disconnect();
  await disconnectMongoDB();
});
