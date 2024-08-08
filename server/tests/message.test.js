const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { generateFakeUsers } = require('../utils/seeds');
const ioc = require('socket.io-client');
const { createTestUser, addContacts, loginUser } = require('./userHelper');
const Chat = require('../models/chat.model');
const app = require('../index');
const getSchool = require('../services/schoolService');
const { io } = require('../socket/socket');
const Message = require('../models/message.model');

let jwt;
let userInfo;
let clientSocket;
let contacts = [];
let contactSockets = {
  contact1: null,
  contact2: null,
};
let chat;
let fourthGroupMemberSocket;
let fourthGroupMember;
let initialMessage;
let fakeUsers;
let lastMessageCreatedAt;

beforeAll(async () => {
  await initializeMongoDB();
  fakeUsers = await generateFakeUsers();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  fourthGroupMember = fakeUsers[2];

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id },
  });
  fourthGroupMemberSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: fakeUsers[2]._id },
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
    members: [...contacts, fakeUsers[2]._id, user],
    messages: [],
    chatType: 'group',
    chatName: 'Test Chat',
  }); // create a group chat for testing
  clientSocket.emit('joinroom', `chat-${chat._id}`);
  contactSockets.contact1.emit('joinroom', `chat-${chat._id}`);
  contactSockets.contact2.emit('joinroom', `chat-${chat._id}`);
  console.log(
    fakeUsers[2].firstName,
    contacts[1].firstName,
    contacts[0].firstName,
    userInfo.firstName
  );
}, 9000);
('Asha, Dianna, Amely, Test');
const getRealTimeMessages = (socket, event) => {
  return new Promise((resolve, reject) => {
    socket.on(event, (arg) => {
      resolve(arg);
    });
  });
};

describe('POST /message', () => {
  it('Should send a message to the group chat', async () => {
    let messagePromise;
    for (let i = 0; i < 2; i++) {
      messagePromise = getRealTimeMessages(
        contactSockets[`contact${i + 1}`],
        'newMessage'
      );
    }

    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...jwt])
      .send({ message: 'Hi from test user' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    initialMessage = response.body;
    const updatedChat = await Chat.findById(chat._id);
    expect(response.body.message).toBe('Hi from test user');
    expect(response.body.receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[0]._id, contacts[1]._id])
    );
    expect(response.body.author._id.toString()).toBe(userInfo._id);
    expect(updatedChat.messages.length).toBe(1);
    expect(updatedChat.messages[0]._id.toString()).toBe(response.body._id);
    expect(response.body.isClubChatMsg).toBe(false);

    const messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Hi from test user');
  });

  it('Should send a message back to the test user with an image', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { token, user } = await loginUser(
      contacts[0].username,
      process.env.FAKE_USER_PASSWORD
    );
    let messagePromise = getRealTimeMessages(clientSocket, 'newMessage');
    let notificationPromise = new Promise((resolve, reject) => {
      fourthGroupMemberSocket.on('newMessageNotify', (unreadMessages) =>
        resolve(unreadMessages)
      );
    });

    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...token])
      .attach('image', `${__dirname}/test-image.png`)
      .field({ message: `Hi from ${user.firstName}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(`Hi from ${user.firstName}`);
    expect(response.body.media.src).toBeTruthy();
    expect(response.body.media.fileType).toBe('image/png');
    expect(response.body.isClubChatMsg).toBe(false);

    const messageEvent = await messagePromise;
    const unreadMessagesEvent = await notificationPromise;
    expect(messageEvent.author._id.toString()).toBe(contacts[0]._id);
    expect(unreadMessagesEvent.length).toBe(1);
    expect(unreadMessagesEvent[0].messages.length).toBe(2);
  });

  it('Should send one more message', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { token, user } = await loginUser(
      contacts[1].username,
      process.env.FAKE_USER_PASSWORD
    );
    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...token])
      .attach('image', `${__dirname}/test-image.png`)
      .field({ message: `Hi from ${user.firstName}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });
  it('Should send one last message', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { token, user } = await loginUser(
      fakeUsers[2].username,
      process.env.FAKE_USER_PASSWORD
    );
    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...token])
      .attach('image', `${__dirname}/test-image.png`)
      .field({ message: `Hi from ${user.firstName}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    lastMessageCreatedAt = response.body.createdAt;
    console.log(response.body);
  });

  it('Should ensure the chat streak is increased by 1', async () => {
    const chatItem = await Chat.findById(chat._id);
    expect(chatItem.streak).toBe(1);
    expect(chatItem.highestStreak).toBe(1);
  });
});

describe('GET /messages', () => {
  let fourthMemberToken;
  let dateQuery;

  it('Should get messages based on a chat ID', async () => {
    // Adding delay to ensure messages are saved
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await request(app)
      .get(`/api/message/messages/${chat._id}/${new Date(Date.now())}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    dateQuery = response.body[1].createdAt;
    const sorted = response.body.reverse();
    console.log(sorted);
    expect(sorted.length).toBe(2);
    expect(sorted[0].message).toBe(`Hi from ${contacts[1].firstName}`);
    expect(sorted[0].author._id.toString()).toBe(contacts[1]._id);
    expect(sorted[1].message).toBe(`Hi from ${fakeUsers[2].firstName}`);
    expect(sorted[1].author._id.toString()).toBe(fakeUsers[2]._id.toString());
  });
  it('Should get the remaining two messages via pagination', async () => {
    // Adding delay to ensure messages are saved

    const response = await request(app)
      .get(`/api/message/messages/${chat._id}/${new Date(dateQuery)}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const sorted = response.body.reverse();
    console.log(sorted);

    expect(sorted.length).toBe(2);
    expect(sorted[0].message).toBe('Hi from test user');
    expect(sorted[0].author._id.toString()).toBe(userInfo._id);
    expect(sorted[0].receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[0]._id, contacts[1]._id])
    );
    expect(sorted[1].message).toBe(`Hi from ${contacts[0].firstName}`);
    expect(sorted[1].author._id.toString()).toBe(contacts[0]._id);
    expect(sorted[1].receivers.map((item) => String(item._id))).toEqual(
      expect.arrayContaining([contacts[1]._id, userInfo._id])
    );
  });

  it('Should ensure the fourth member of the group chat has two unread messages', async () => {
    const { token, user } = await loginUser(
      fourthGroupMember.username,
      process.env.FAKE_USER_PASSWORD
    );
    fourthMemberToken = token;
    const response = await request(app)
      .get(`/api/users/personalprofile`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.unreadChats.length).toBe(1);
    expect(response.body.unreadChats[0].messages.length).toBe(3);
    expect(response.body.unreadChats[0].chat.chatName).toBe('Test Chat');
    expect(response.body.unreadChats[0].messages[0].message).toBe(
      'Hi from test user'
    );
    expect(response.body.unreadChats[0].messages[1].message).toBe(
      `Hi from ${contacts[0].firstName}`
    );
  });

  it('Should clear the unread messages of the fourth member', async () => {
    let notificationPromise = new Promise((resolve, reject) => {
      fourthGroupMemberSocket.on('newMessageNotify', (unreadMessages) =>
        resolve(unreadMessages)
      );
    });

    const response = await request(app)
      .get(`/api/message/messages/${chat._id}/${new Date(Date.now())}`)
      .set('Cookie', [...fourthMemberToken])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const unreadMessagesEvent = await notificationPromise;
    expect(unreadMessagesEvent.length).toBe(0);
  });
});

describe('PATCH /messages', () => {
  it('Should update the text of the initial message sent by the test user', async () => {
    let messagePromise;
    for (let i = 0; i < 2; i++) {
      messagePromise = getRealTimeMessages(
        contactSockets[`contact${i + 1}`],
        'editMessage'
      );
    }

    const response = await request(app)
      .patch(`/api/message/editmessage/${initialMessage._id}`)
      .set('Cookie', [...jwt])
      .send({ messageText: 'Hi from test user, 2.0' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Hi from test user, 2.0');
    expect(response.body.author._id.toString()).toBe(userInfo._id);

    const messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Hi from test user, 2.0');
  });
});

describe('DELETE /messages', () => {
  it('Should delete the initial message sent by the test user', async () => {
    let messagePromise;
    for (let i = 0; i < 2; i++) {
      messagePromise = getRealTimeMessages(
        contactSockets[`contact${i + 1}`],
        'deletedMessage'
      );
    }

    const response = await request(app)
      .delete(`/api/message/${initialMessage._id}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const deletedMessage = await Message.findById(response.body._id);
    expect(deletedMessage).toBe(null);
    const messageEvent = await messagePromise;
    expect(messageEvent._id.toString()).toBe(response.body._id.toString());
  });
});

describe('STREAK /messages', () => {
  it('Should no longer update the chat streak after it has been accomplished for the day', async () => {
    const response = await request(app)
      .post(`/api/message/sendmessage/${chat._id}`)
      .set('Cookie', [...jwt])
      .send({ message: 'Total Test' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const chatItem = await Chat.findById(chat._id);
    expect(chatItem.streak).toBe(1);
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  contactSockets.contact1.disconnect();
  contactSockets.contact2.disconnect();
  await disconnectMongoDB();
});
