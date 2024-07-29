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
    // connect logged in user to socket io
    query: { userId: userInfo._id },
  });

  for (let i = 0; i < 2; i++) {
    contactSockets[`contact${i + 1}`] = ioc(
      `http://localhost:${process.env.PORT}`,
      {
        query: { userId: fakeUsers[i]._id },
      }
    ); // connects the two users who will be part of future chats as an object
    const contactsData = await addContacts(token, fakeUsers[i]._id);
    if (i === 1) contacts = contactsData;
  }
});

describe('POST /chats', () => {
  const getRealTimeChat = (i) => {
    return new Promise((resolve, reject) => {
      contactSockets[`contact${i + 1}`].on('newChat', (chat) => {
        console.log('Chat created in real time: ', chat);
        resolve(chat);
      });
    });
  };

  it('Should create a group chat with three members', async () => {
    let chatPromise;
    for (let i = 0; i < 2; i++) {
      chatPromise = getRealTimeChat(i);
    }

    const response = await request(app)
      .post('/api/chats/createchat')
      .set('Cookie', [...jwt])
      .send({ members: contacts, chatName: 'Test Chat' })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    chat = response.body;

    expect(response.body.chatName).toBe('Test Chat');
    expect(response.body.chatType).toBe('group');
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toEqual(
      expect.arrayContaining([
        contacts[0]._id.toString(),
        contacts[1]._id.toString(),
        userInfo._id.toString(),
      ])
    );
    const chatEvent = await chatPromise;
    console.log(chatEvent);
    expect(chatEvent.chatName).toBe('Test Chat');
  });

  it('Should create a group chat with one contact of the test user', async () => {
    const response = await request(app)
      .post('/api/chats/createchat')
      .set('Cookie', [...jwt])
      .send({ members: [contacts[0]] })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.members.length).toBe(2);
    expect(response.body.chatType).toBe('individual');
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toContain(userInfo._id.toString());
    expect(
      response.body.members.map((member) => member._id.toString())
    ).toContain(contacts[0]._id.toString());
  });

  it('Should receive the new chat sent to the members in real time', async () => {
    for (let i = 0; i < 2; i++) {
      contactSockets[`contact${i + 1}`].on('newChat', (chat) => {
        // ensure that the user's who were created as members of a chat are sent that chat in real time
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

describe('GET /chats', () => {
  it('Should get the group chat the test user is part of', async () => {
    const response = await request(app)
      .get('/api/chats/getchats/group')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].chatName).toBe('Test Chat');
    expect(response.body[0].chatType).toBe('group');
    expect(
      response.body[0].members.map((member) => member._id.toString())
    ).toEqual(
      expect.arrayContaining([
        contacts[0]._id.toString(),
        contacts[1]._id.toString(),
        userInfo._id.toString(),
      ])
    );
  });

  it('Should get the chat between the test user and one other contact', async () => {
    const response = await request(app)
      .get('/api/chats/getchats/individual')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(
      response.body[0].members.map((member) => member._id.toString())
    ).toEqual(
      expect.arrayContaining([
        contacts[0]._id.toString(),
        userInfo._id.toString(),
      ])
    );
  });
});

describe('PATCH /chats', () => {
  it('Should update the chat name and picture', async () => {
    const response = await request(app)
      .patch(`/api/chats/updatechat/${chat._id}`)
      .set('Cookie', [...jwt])
      .attach('photo', `${__dirname}/test-pfp.jpg`)
      .field({ chatName: 'Test Chat 2.0' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body._id).toBe(chat._id.toString());
    expect(response.body.chatName).toBe('Test Chat 2.0');
  });

  it('Should have the test user leave the test group chat', async () => {
    const response = await request(app)
      .patch(`/api/chats/leavechat/${chat._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.members.length).toBe(2);
    expect(
      response.body.members.map((member) => String(member._id))
    ).not.toContain(userInfo._id);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
  clientSocket.disconnect();
});
