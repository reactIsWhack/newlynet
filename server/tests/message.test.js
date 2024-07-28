const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { generateFakeUsers } = require('../utils/seeds');
const ioc = require('socket.io-client');
const { createTestUser, addContacts, loginUser } = require('./userHelper');
const Chat = require('../models/chat.model');
const app = require('../index');
const getSchool = require('../services/schoolService');
const { io } = require('../socket/socket');

let jwt;
let userInfo;
let clientSocket;
let contacts = [];
let contactSockets = {
  contact1: null,
  contact2: null,
};
let chat;

beforeAll(async () => {
  await initializeMongoDB();
  fakeUsers = await generateFakeUsers();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id },
  });

  for (let i = 0; i < 2; i++) {
    contactSockets[`contact${i + 1}`] = ioc(
      `http://localhost:${process.env.PORT}`,
      {
        query: { userId: fakeUsers[i]._id },
      }
    );
    const contactsInfo = await addContacts(token, fakeUsers[i]._id);
    if (i === 1) contacts = contactsInfo;
  }

  chat = await Chat.create({
    members: [...contacts, user],
    messages: [],
    chatType: 'group',
    chatName: 'Test Chat',
  }); // create a group chat for testing
}, 9000);

const getRealTimeMessages = (socket) => {
  console.log(socket);
  return new Promise((resolve, reject) => {
    socket.on('newMessage', (arg) => {
      console.log('Received newMessage event:', arg);
      resolve(arg);
    });
  });
};

describe('POST /message', () => {
  it('Should send a message to the group chat', async () => {
    let messagePromise;
    for (let i = 0; i < 2; i++) {
      messagePromise = getRealTimeMessages(contactSockets[`contact${i + 1}`]);
    }

    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...jwt])
      .send({ message: 'Hi from test user' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const updatedChat = await Chat.findById(chat._id);
    expect(response.body.message).toBe('Hi from test user');
    expect(response.body.receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[0]._id, contacts[1]._id])
    );
    expect(response.body.author._id.toString()).toBe(userInfo._id);
    expect(updatedChat.messages.length).toBe(1);
    expect(updatedChat.messages[0]._id.toString()).toBe(response.body._id);

    const messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Hi from test user');
  });

  it('Should send a message back to the test user with an image', async () => {
    const { token, user } = await loginUser(
      contacts[0].username,
      process.env.FAKE_USER_PASSWORD
    );
    let messagePromise = getRealTimeMessages(clientSocket);

    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...token])
      .attach('image', `${__dirname}/test-image.png`)
      .field({ message: `Hi from ${user.fullName}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    console.log(response.body, 'response message');

    expect(response.body.message).toBe(`Hi from ${user.fullName}`);
    expect(response.body.media.src).toBeTruthy();
    expect(response.body.media.fileType).toBe('image/png');

    const messageEvent = await messagePromise;
    expect(messageEvent.author._id.toString()).toBe(contacts[0]._id);
  });
});

describe('GET /messages', () => {
  it('Should get messages based off a chat id', async () => {
    const response = await request(app)
      .get(`/api/message/messages/${chat._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(2);
    expect(response.body[0].message).toBe('Hi from test user');
    expect(response.body[0].author._id.toString()).toBe(userInfo._id);
    expect(response.body[0].receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[0]._id, contacts[1]._id])
    );
    expect(response.body[1].message).toBe(`Hi from ${contacts[0].fullName}`);
    expect(response.body[1].author._id.toString()).toBe(contacts[0]._id);
    expect(response.body[1].receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[1]._id, userInfo._id])
    );
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  contactSockets.contact1.disconnect();
  contactSockets.contact2.disconnect();
  await disconnectMongoDB();
});
