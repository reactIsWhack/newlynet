const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const request = require('supertest');
const getSchool = require('../services/schoolService');
const { createTestUser, loginUser, joinClubServer } = require('./userHelper');
const { app } = require('../socket/socket');
const ioc = require('socket.io-client');
const ClubChat = require('../models/clubChat.model');
const ClubServer = require('../models/clubServer.model');
const User = require('../models/user.model');
const { populateDB } = require('../utils/seeds');

let jwt;
let userInfo;
let clientSocket;
let secondSocket;
let secondUser;
let clubServer;
let thirdUser;
let thirdToken;

beforeAll(async () => {
  await initializeMongoDB();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  [secondUser, thirdUser] = await User.find({
    'school.schoolId': user.school.schoolId,
    _id: { $ne: user._id },
  });
  const [secondUserData, thirdUserData] = await Promise.all([
    loginUser(secondUser.username, process.env.FAKE_USER_PASSWORD),
    loginUser(thirdUser.username, process.env.FAKE_USER_PASSWORD),
  ]);
  thirdToken = thirdUserData.token;

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id },
  });

  secondSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: secondUser._id },
  });

  clubServer = await ClubServer.findOne({
    schoolAffiliation: user.school.schoolId,
  }).populate('chats');
  for (let i = 0; i < 3; i++) {
    await joinClubServer(
      clubServer._id,
      i === 0 ? token : i === 1 ? secondUserData.token : thirdUserData.token
    );
  }

  clientSocket.emit(
    'joinroom',
    `clubserver-${clubServer._id}-${clubServer.chats[0]._id}`,
    true,
    clubServer.chats[0].chatTopic
  );
  secondSocket.emit(
    'joinroom',
    `clubserver-${clubServer._id}-${clubServer.chats[0]._id}`,
    true,
    clubServer.chats[0].chatTopic
  );
});

const getRealTimeMessages = (socket, event) => {
  return new Promise((resolve, reject) => {
    socket.on(event, (chat, msg) => {
      resolve({ chat, msg });
    });
  });
};

describe('POST /clubChat', () => {
  it('Should send a message to the second user in the room', async () => {
    const messagePromise = getRealTimeMessages(
      secondSocket,
      'newClubServerMsg'
    );

    const response = await request(app)
      .post(`/api/club-chat/${clubServer._id}`)
      .set('Cookie', [...jwt])
      .send({
        message: 'Hi from test user',
        chatSection: clubServer.chats[0].chatTopic,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Hi from test user');
    expect(response.body.author._id.toString()).toBe(userInfo._id.toString());
    expect(response.body.receivers.map((r) => String(r._id))).toEqual(
      expect.arrayContaining([String(secondUser._id)])
    );
    const messageEvent = await messagePromise;
    expect(messageEvent.msg.message).toBe('Hi from test user');
    const updatedChat = await ClubChat.findById(messageEvent.chat._id);
    expect(updatedChat.messages[0]._id.toString()).toBe(
      response.body._id.toString()
    );
  });

  it('Should send two more messages', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app)
        .post(`/api/club-chat/${clubServer._id}`)
        .set('Cookie', [...jwt])
        .send({
          message: `Extra message ${i + 1}`,
          chatSection: clubServer.chats[0].chatTopic,
        })
        .expect(201)
        .expect('Content-Type', /application\/json/);
    }
  });
});

describe('GET /clubChat', () => {
  let dateQuery;
  it('Should get the first two messages sent in the club chat', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await request(app)
      .get(`/api/club-chat/${clubServer.chats[0]._id}/${new Date(Date.now())}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    dateQuery = response.body[1].createdAt;
    expect(response.body.length).toBe(2);
    expect(response.body[0].message).toBe('Extra message 2');
    expect(response.body[1].message).toBe('Extra message 1');
  });

  it('Should get the oldest message sent in the club chat via pagination', async () => {
    const response = await request(app)
      .get(`/api/club-chat/${clubServer.chats[0]._id}/${dateQuery}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].message).toBe('Hi from test user');
    expect(response.body[0].author._id.toString()).toBe(
      userInfo._id.toString()
    );
  });

  it('Should ensure the third member has 3 unread club chat messages', async () => {
    const user = await User.findById(thirdUser._id);

    thirdUser = user;
    console.log(user);
    expect(user.unreadClubChatMessages.length).toBe(1);
    expect(user.unreadClubChatMessages[0].chat._id.toString()).toBe(
      clubServer.chats[0]._id.toString()
    );
    expect(user.unreadClubChatMessages[0].messages.length).toBe(3);
  });
});

describe('PATCH /clubChat', () => {
  it('Should have the third rember read their unread messages', async () => {
    const response = await request(app)
      .patch(`/api/club-chat/${thirdUser.unreadClubChatMessages[0]._id}`)
      .set('Cookie', [...thirdToken])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.unreadClubChatMessages.length).toBe(0);
    expect(response.body.unreadClubChatMessages).toEqual([]);
  });
});

afterAll(async () => {
  clientSocket.emit(
    'leaveroom',
    `clubserver-${clubServer._id}-${clubServer.chats[0]._id}`,
    true
  );
  secondSocket.emit(
    'leaveroom',
    `clubserver-${clubServer._id}-${clubServer.chats[0]._id}`,
    true
  );
  clientSocket.disconnect();
  secondSocket.disconnect();
  await disconnectMongoDB();
});
