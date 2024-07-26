const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { generateFakeUsers } = require('../utils/seeds');
const ioc = require('socket.io-client');
const { createTestUser, addContacts, loginUser } = require('./userHelper');
const Chat = require('../models/chat.model');
const app = require('../index');
const getSchool = require('../services/schoolService');

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
    members: contacts,
    messages: [],
    chatType: 'group',
    chatName: 'Test Chat',
  }); // create a group chat for testing
});

describe('POST /message', () => {
  it('Should send a message to the group chat', async () => {
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
  });

  it('Should send the message to the receivers in real time', async () => {
    for (let i = 0; i < 2; i++) {
      contactSockets[`contact${i + 1}`].on('newMessage', (newMessage) => {
        expect(newMessage.message).toBe('Hi from test user');
      });
    }
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
