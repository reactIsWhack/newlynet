const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const getSchool = require('../services/schoolService');
const { generateFakeUsers } = require('../utils/seeds');
const { createTestUser, addContacts, loginUser } = require('./userHelper');
const request = require('supertest');
const app = require('../index');
const ioc = require('socket.io-client');
const Chat = require('../models/chat.model');

let fakeUsers;
let contacts = [];
let jwt;
let userInfo;
let clientSocket;
let contactSockets = {};
let chat;
let chatWithStreak;

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
  chatWithStreak = await Chat.create({
    chatType: 'individual',
    members: [userInfo._id, fakeUsers[2]._id],
    streak: 5,
    accomplishedDailyStreak: {
      accomplished: true,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }, // 2 days ago
    messages: [],
  });
  console.log(chatWithStreak, 'chat with streak');
});

const getRealTimeChat = (i, event) => {
  return new Promise((resolve, reject) => {
    contactSockets[`contact${i + 1}`].on(event, (chat) => {
      resolve(chat);
    });
  });
};

describe('POST /chats', () => {
  it('Should create a group chat with three members', async () => {
    let chatPromise;
    for (let i = 0; i < 2; i++) {
      chatPromise = getRealTimeChat(i, 'newChat');
    }

    const response = await request(app)
      .post('/api/chats/createchat')
      .set('Cookie', [...jwt])
      .send({ members: contacts })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    chat = response.body;

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
      response.body[1].members.map((member) => member._id.toString())
    ).toEqual(
      expect.arrayContaining([
        contacts[0]._id.toString(),
        userInfo._id.toString(),
      ])
    );
  });

  it('Should reset the chat streak if no message has been sent within a day', async () => {
    const response = await request(app)
      .get('/api/chats/getchats/individual')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedChat = response.body.find(
      (item) => item._id === chatWithStreak._id.toString()
    );
    console.log(updatedChat);

    expect(updatedChat.streak).toBe(0);
    expect(updatedChat.accomplishedDailyStreak.accomplished).toBe(false);
    expect(updatedChat.accomplishedDailyStreak.date).toBe(null);
  });
});

describe('PATCH /chats', () => {
  it('Should update the chat name and picture', async () => {
    let chatPromise;
    for (let i = 0; i < 2; i++) {
      chatPromise = getRealTimeChat(i, 'updatedChat');
    }

    const response = await request(app)
      .patch(`/api/chats/updatechat/${chat._id}`)
      .set('Cookie', [...jwt])
      .attach('photo', `${__dirname}/test-pfp.jpg`)
      .field({ chatName: 'Test Chat 2.0' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body._id).toBe(chat._id.toString());
    expect(response.body.chatName).toBe('Test Chat 2.0');

    const chatEvent = await chatPromise;
    expect(chatEvent.chatName).toBe('Test Chat 2.0');
  });

  it('Should have the test user leave the test group chat', async () => {
    let chatPromise;
    for (let i = 0; i < 2; i++) {
      chatPromise = getRealTimeChat(i, 'memberChange');
    }

    const response = await request(app)
      .patch(`/api/chats/leavechat/${chat._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.members.length).toBe(2);
    expect(
      response.body.members.map((member) => String(member._id))
    ).not.toContain(userInfo._id);

    const chatEvent = await chatPromise;
    expect(chatEvent.members.length).toBe(2);
    expect(
      response.body.members.map((member) => String(member._id))
    ).not.toContain(userInfo._id);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
  clientSocket.disconnect();
});
