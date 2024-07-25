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
let userWithCommonInterests;
let school;

beforeAll(async () => {
  await initializeMongoDB();
  await generateFakeUsers();
  fakeUsers = await getFakeUsers();
  console.log(fakeUsers, 'fakeUsers');
  userWithCommonInterests = fakeUsers[1];

  school = await getSchool('PrincetonHighSchool');
  await User.create({
    fullName: 'test jest',
    username: 'test',
    password: 'test123',
    grade: 9,
    school,
    interests: fakeUsers[1].interests.slice(0, 2),
  });
  const loginInfo = await loginUser('test', 'test123');
  token = loginInfo.token;
  userInfo = loginInfo.user;
}, 9000);

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

describe('GET /users', () => {
  it('Should get users in the same grade and school as the test user', async () => {
    const response = await request(app)
      .get(`/api/users/commonstudents/grade/${new Date(Date.now())}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);
    console.log(response.body);

    expect(response.body.map((user) => user._id.toString())).not.toContain(
      fakeUsers[0]._id.toString()
    );
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body.map((user) => user.school)).toEqual(
      expect.arrayContaining([expect.objectContaining(school)])
    );
  });

  it('Should get users in the same school based off common interests', async () => {
    const response = await request(app)
      .get(`/api/users/commonstudents/interests/${new Date(Date.now())}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body, userWithCommonInterests, userInfo.interests);

    expect(response.body.map((user) => user._id.toString())).toContain(
      userWithCommonInterests._id.toString()
    );
    const interestsArr = response.body.map((item) => item.interests);
    for (const interestArr of interestsArr) {
      expect(
        interestArr.some((interest) => userInfo.interests.includes(interest))
      ).toBe(true);
    }
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
