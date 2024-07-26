const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const getSchool = require('../services/schoolService');
const { generateFakeUsers } = require('../utils/seeds');
const { createTestUser, addContacts, loginUser } = require('./userHelper');
const request = require('supertest');
const app = require('../index');
const ioc = require('socket.io-client');

let fakeUsers;
let contacts = [];
let jwt;
let userInfo;
let clientSocket;
let contactSockets = {};

beforeAll(async () => {
  await initializeMongoDB();
  fakeUsers = await generateFakeUsers();

  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school);
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: userInfo._id },
  });

  for (let i = 0; i < 2; i++) {
    contactSockets[`contact${i + 1}`] = ioc(
      `http://localhost:${process.env.PORT}`,
      {
        query: { userId: fakeUsers[i]._id },
      }
    );
    const contactsData = await addContacts(token, fakeUsers[i]._id);
    if (i === 1) contacts = contactsData;
  }
});

describe('POST /chats', () => {
  it('Should create a group chat with one contact of the test user', async () => {
    const response = await request(app)
      .post('/api/chats/createchat')
      .set('Cookie', [...jwt])
      .send({ members: [contacts[0]] })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.members.length).toBe(2);
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toContain(userInfo._id.toString());
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toContain(contacts[0]._id.toString());
  });

  it('Should create a group chat with three members', async () => {
    const response = await request(app)
      .post('/api/chats/createchat')
      .set('Cookie', [...jwt])
      .send({ members: contacts, chatName: 'Test Chat' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.chatName).toBe('Test Chat');
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toEqual(
      expect.arrayContaining([
        contacts[0]._id.toString(),
        contacts[1]._id.toString(),
        userInfo._id.toString(),
      ])
    );
  });

  it('Should receive the new chat sent to the members in real time', async () => {
    for (let i = 0; i < 2; i++) {
      contactSockets[`contact${i + 1}`].on('newChat', (chat) => {
        expect(chat.members).toEqual(
          expect.arrayContaining([
            contacts[0]._id.toString(),
            contacts[1]._id.toString(),
            userInfo._id.toString(),
          ])
        );
        expect(chat.chatName).toBe('Test Chat');
      });
    }
  });
});

afterAll(async () => {
  await disconnectMongoDB();
  clientSocket.disconnect();
});
