const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { generateFakeUsers } = require('../utils/seeds');
const User = require('../models/user.model');
const { loginUser, getFakeUsers } = require('./userHelper');
const request = require('supertest');
const app = require('../index');
const getSchool = require('../services/schoolService');

let token;
let userInfo;
let fakeUsers;

beforeAll(async () => {
  await initializeMongoDB();
  await generateFakeUsers();
  fakeUsers = await getFakeUsers();
  const school = await getSchool('PrincetonHighSchool');
  await User.create({
    fullName: 'test jest',
    username: 'test',
    password: 'test123',
    grade: 9,
    school,
    interests: ['Computer Science'],
  });
  const loginInfo = await loginUser('test', 'test123');
  token = loginInfo.token;
  userInfo = loginInfo.user;
});

describe('PATCH /users', () => {
  it('Should add a new contact for the test user', async () => {
    const response = await request(app)
      .patch(`/api/users/addcontact/${fakeUsers[0]._id}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.contacts.length).toBe(1);
    expect(response.body.contacts[0]._id.toString()).toBe(
      fakeUsers[0]._id.toString()
    );
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
