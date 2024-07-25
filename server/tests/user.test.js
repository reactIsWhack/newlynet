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
  fakeUsers = await generateFakeUsers();
  console.log(fakeUsers);
  userWithCommonInterests = fakeUsers[1];
  console.log(userWithCommonInterests, 'common interests user');

  school = await getSchool('PrincetonHighSchool');
  await User.create({
    fullName: 'test jest',
    username: 'test',
    password: 'test123',
    grade: 9,
    school,
    interests: userWithCommonInterests.interests.slice(0, 2),
    contacts: [],
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
  let nextCursor;
  it('Should get users in the same grade and school as the test user', async () => {
    const response = await request(app)
      .get(`/api/users/commonstudents/grade`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    nextCursor = response.body.nextCursor;

    expect(
      response.body.users.map((user) => user._id.toString())
    ).not.toContain(fakeUsers[0]._id.toString());
    expect(response.body.users.length).toBeGreaterThanOrEqual(1);
    expect(response.body.users.map((user) => user.school)).toEqual(
      expect.arrayContaining([expect.objectContaining(school)])
    );
  });

  it('Should paginate the get common students request', async () => {
    const response = await request(app)
      .get(`/api/users/commonstudents/grade?cursor=${nextCursor}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
  });

  it('Should get users in the same school based off common interests', async () => {
    const response = await request(app)
      .get(`/api/users/commonstudents/interests`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body, userInfo.interests);

    expect(response.body.users.map((user) => user._id.toString())).toContain(
      userWithCommonInterests._id.toString()
    );
    const interestsArr = response.body.users.map((item) => item.interests);
    for (const interestArr of interestsArr) {
      expect(
        interestArr.some((interest) => userInfo.interests.includes(interest))
      ).toBe(true);
    }
  });

  it("Should get a user's personal profile", async () => {
    const response = await request(app)
      .get('/api/users/personalprofile')
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.fullName).toBe('test jest');
    expect(response.body.username).toBe('test');
    expect(response.body.grade).toBe(9);
    expect(response.body.contacts.length).toBe(1);
    expect(response.body.contacts[0]._id.toString()).toBe(
      fakeUsers[0]._id.toString()
    );
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
