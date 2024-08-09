const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const request = require('supertest');
const getSchool = require('../services/schoolService');
const { createTestUser, loginUser } = require('./userHelper');
const { app } = require('../socket/socket');
const { shuffledInterests, generateFakeUsers } = require('../utils/seeds');
const ioc = require('socket.io-client');
const ClubChat = require('../models/clubChat.model');

let jwt;
let userInfo;
let fakeUsers;
let clientSocket;
let secondSocket;
let secondUser;

beforeAll(async () => {
  await initializeMongoDB();
  fakeUsers = await generateFakeUsers();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  secondUser = fakeUsers[0];

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id },
  });
  secondSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: fakeUsers[0]._id },
  });

  clientSocket.emit('joinroom', `clubchat-${user.school.schoolId}`, true);
  secondSocket.emit(
    'joinroom',
    `clubchat-${fakeUsers[0].school.schoolId}`,
    true
  );

  console.log('Before all finished');
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

const getRealTimeMessages = (socket, event) => {
  return new Promise((resolve, reject) => {
    socket.on(event, (arg) => {
      console.log(arg);
      resolve(arg);
    });
  });
};

describe('POST /clubChats', () => {
  it('Should send a general message', async () => {
    console.log('Sending message...');
    let messagePromise = getRealTimeMessages(secondSocket, 'clubChatMsg');

    const response = await request(app)
      .post(`/api/club-chat/clubchatmsg`)
      .set('Cookie', [...jwt])
      .send({ message: 'Test club chat', messageType: 'general' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const udpatedClubChat = await ClubChat.findOne({ isActive: true });
    expect(udpatedClubChat.generalMessages.length).toBe(1);
    expect(udpatedClubChat.generalMessages[0]._id.toString()).toBe(
      response.body._id.toString()
    );

    expect(response.body.message).toBe('Test club chat');
    expect(response.body.isClubChatMsg).toBe(true);
    expect(response.body.receivers.map((item) => item._id.toString())).toEqual(
      expect.arrayContaining([secondUser._id.toString()])
    );

    let messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Test club chat');
  });

  it('Should send a topic message', async () => {
    console.log('Sending message...');
    let messagePromise = getRealTimeMessages(secondSocket, 'clubChatMsg');

    const response = await request(app)
      .post(`/api/club-chat/clubchatmsg`)
      .set('Cookie', [...jwt])
      .send({ message: 'Test club 2.0', messageType: 'topic' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const udpatedClubChat = await ClubChat.findOne({ isActive: true });
    expect(udpatedClubChat.topicMessages.length).toBe(1);
    expect(udpatedClubChat.topicMessages[0]._id.toString()).toBe(
      response.body._id.toString()
    );

    expect(response.body.message).toBe('Test club 2.0');
    expect(response.body.isClubChatMsg).toBe(true);
    expect(response.body.receivers.map((item) => item._id.toString())).toEqual(
      expect.arrayContaining([secondUser._id.toString()])
    );

    let messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Test club 2.0');
  });
});

describe('GET /clubChats', () => {
  it('Should get the active club chat', async () => {
    const response = await request(app)
      .get(`/api/club-chat/activeclubchat`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.chatTopic).toBe(shuffledInterests[0]);
    expect(response.body.generalMessages.length).toBe(1);
    expect(response.body.topicMessages.length).toBe(1);
    expect(response.body.isActive).toBe(true);
    expect(response.body._id).toBeTruthy();
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  secondSocket.disconnect();
  await disconnectMongoDB();
});
