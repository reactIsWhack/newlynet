const request = require('supertest');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const getSchool = require('../services/schoolService');
const { createTestUser, loginUser } = require('./userHelper');
const { app } = require('../socket/socket');
const { shuffledInterests } = require('../utils/seeds');

let jwt;
let userInfo;

beforeAll(async () => {
  await initializeMongoDB();
  const school = await getSchool('PrincetonHighSchool');
  await createTestUser(['art'], school); // create a test user and log them in
  const { token, user } = await loginUser('test', 'test123');
  jwt = token;
  userInfo = user;
});

describe('GET /clubserver', () => {
  it('Should get the club server for the princeton user', async () => {
    const response = await request(app)
      .get('/api/clubserver')
      .set('Cookie', [...jwt])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.schoolAffiliation).toBe(userInfo.school.schoolId);
    expect(response.body.chats[0].chatTopic).toBe(shuffledInterests[0]);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
