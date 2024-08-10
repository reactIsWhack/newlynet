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
let secondUserToken;

beforeAll(async () => {
  await initializeMongoDB();
  fakeUsers = await generateFakeUsers();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
  secondUser = fakeUsers[0];
  const secondUserData = await loginUser(
    secondUser.username,
    process.env.FAKE_USER_PASSWORD
  );
  secondUserToken = secondUserData.token;

  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: user._id, school: user.school.schoolId },
  });
  secondSocket = ioc(`http://localhost:${process.env.PORT}`, {
    query: { userId: secondUser._id, school: secondUser.school.schoolId },
  });

  clientSocket.emit('joinroom', `clubchat-${user.school.schoolId}`, true);
  secondSocket.emit(
    'joinroom',
    `clubchat-${fakeUsers[0].school.schoolId}`,
    true
  );

  console.log('Before all finished');
});

const getRealTimeMessages = (socket, event) => {
  return new Promise((resolve, reject) => {
    socket.on(event, (arg) => {
      console.log(arg);
      resolve(arg);
    });
  });
};

let montgomeryMsgId;

describe('PATCH /clubChats', () => {
  it('Should have both users join the club chat', async () => {
    for (let i = 0; i < 2; i++) {
      const joinPromise = new Promise((resolve, reject) => {
        secondSocket.on('clubChatJoin', (clubChat, user) => {
          resolve({ clubChat, user });
        });
      });

      const response = await request(app)
        .patch(`/api/club-chat/joinclubchat`)
        .set('Cookie', i === 0 ? [...jwt] : [...secondUserToken])
        .expect(200)
        .expect('Content-Type', /application\/json/);

      i === 0 &&
        expect(response.body.members[0]._id.toString()).toBe(
          userInfo._id.toString()
        );
      i === 1 &&
        expect(response.body.members[1]._id.toString()).toBe(
          secondUser._id.toString()
        );

      if (i === 0) {
        const joinEvent = await joinPromise;
        expect(
          joinEvent.clubChat.members.map((m) => m._id.toString())
        ).toContain(userInfo._id.toString());
        expect(joinEvent.user._id.toString()).toBe(userInfo._id.toString());
      }
    }
  });

  it('Should have a user from a different school join the club chat', async () => {
    const { user, token } = await loginUser(
      fakeUsers[4].username,
      process.env.FAKE_USER_PASSWORD
    );
    const response = await request(app)
      .patch(`/api/club-chat/joinclubchat`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.members.map((member) => String(member._id))).toContain(
      String(user._id)
    );
  });
});

describe('POST /clubChats', () => {
  it('Should send a general message', async () => {
    console.log('Sending message...');

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
    expect(
      response.body.receivers.map((receiver) => String(receiver._id))
    ).toEqual(expect.arrayContaining([String(secondUser._id)]));

    expect(response.body.message).toBe('Test club chat');
    expect(response.body.isClubChatMsg).toBe(true);
    expect(response.body.schoolAffiliation).toBe(userInfo.school.schoolId);
  });

  it('Should send two more general message', async () => {
    for (let i = 0; i < 2; i++) {
      const response = await request(app)
        .post(`/api/club-chat/clubchatmsg`)
        .set('Cookie', [...jwt])
        .send({ message: `General message ${i + 1}`, messageType: 'general' })
        .expect(201)
        .expect('Content-Type', /application\/json/);
    }
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
    expect(
      response.body.receivers.map((receiver) => String(receiver._id))
    ).toEqual(expect.arrayContaining([String(secondUser._id)]));

    expect(response.body.message).toBe('Test club 2.0');
    expect(response.body.isClubChatMsg).toBe(true);

    let messageEvent = await messagePromise;
    expect(messageEvent.message).toBe('Test club 2.0');
  });

  it('Should have a user from a different school send a general messsage', async () => {
    const { user, token } = await loginUser(
      fakeUsers[4].username,
      process.env.FAKE_USER_PASSWORD
    );

    const response = await request(app)
      .post(`/api/club-chat/clubchatmsg`)
      .set('Cookie', [...token])
      .send({ message: 'Club chat for montgomery', messageType: 'general' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    montgomeryMsgId = response.body._id;
    expect(response.body.message).toBe('Club chat for montgomery');
    expect(response.body.schoolAffiliation).toBe(user.school.schoolId);
    expect(response.body.schoolAffiliation).not.toBe(userInfo.school.schoolId);
    expect(response.body.receivers).toEqual([]);
  });
});

describe('GET /clubChats', () => {
  it('Should get the active club chat', async () => {
    const response = await request(app)
      .get(`/api/club-chat/activeclubchat`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.clubChat.chatTopic).toBe(shuffledInterests[0]);
    expect(response.body.clubChat.generalMessages.length).toBe(4);
    expect(response.body.clubChat.topicMessages.length).toBe(1);
    expect(response.body.clubChat.isActive).toBe(true);
    expect(response.body.clubChat._id).toBeTruthy();
  });

  let dateQuery;
  it('Should get the first message from the general club chat messages', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await request(app)
      .get(`/api/club-chat/messages/general/${new Date(Date.now())}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    dateQuery = response.body[1].createdAt;
    expect(response.body.length).toBe(2);
    expect(response.body.map((item) => String(item._id))).not.toContain(
      String(montgomeryMsgId)
    );
  });

  it('Should get the latest message from the general messages', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(dateQuery);

    const response = await request(app)
      .get(`/api/club-chat/messages/general/${dateQuery}`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.length).toBe(1);
    expect(response.body.map((item) => String(item._id))).not.toContain(
      String(montgomeryMsgId)
    );
    expect(response.body[0].message).toBe('Test club chat');
    expect(response.body[0].author._id.toString()).toBe(userInfo._id);
  });
});

afterAll(async () => {
  clientSocket.disconnect();
  secondSocket.disconnect();
  await disconnectMongoDB();
});
