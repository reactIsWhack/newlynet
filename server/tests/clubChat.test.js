const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const request = require('supertest');
const getSchool = require('../services/schoolService');
const { createTestUser, loginUser } = require('./userHelper');
const { app } = require('../socket/socket');
const { shuffledInterests } = require('../utils/seeds');

let jwt;
let userInfo;
beforeAll(async () => {
  await initializeMongoDB();

  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['Computer Science'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
});

describe('GET /clubChats', () => {
  it('Should get the active club chat', async () => {
    const response = await request(app)
      .get(`/api/club-chat/activeclubchat`)
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.chatTopic).toBe(shuffledInterests[0]);
    expect(response.body.generalMessages).toEqual([]);
    expect(response.body.topicMessages).toEqual([]);
    expect(response.body.isActive).toBe(true);
    expect(response.body._id).toBeTruthy();
  });
});

afterAll(() => {
  disconnectMongoDB();
});
