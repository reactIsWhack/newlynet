const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { generateFakeUsers } = require('../utils/seeds');
const User = require('../models/user.model');
const { loginUser, createTestUser } = require('./userHelper');
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
  userWithCommonInterests = fakeUsers[1];
  console.log(userWithCommonInterests, 'common interests user');

  school = await getSchool('PrincetonHighSchool');
  await createTestUser(
    [...userWithCommonInterests.interests.slice(0, 2), 'Tennis'],
    school
  );
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

    nextCursor = response.body[response.body.length - 1]._id;

    expect(response.body.map((user) => user._id.toString())).not.toContain(
      fakeUsers[0]._id.toString()
    );
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body.map((user) => user.school)).toEqual(
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

    const interestsArr = response.body.map((item) => item.interests);
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

    expect(response.body.firstName).toBe('test');
    expect(response.body.lastName).toBe('jest');
    expect(response.body.username).toBe('test');
    expect(response.body.grade).toBe(9);
    expect(response.body.contacts.length).toBe(1);
    expect(response.body.contacts[0]._id.toString()).toBe(
      fakeUsers[0]._id.toString()
    );
  });
});

describe('UPDATE /users', () => {
  it("Should update the user's grade, profile picture, and interests", async () => {
    const response = await request(app)
      .patch('/api/users/updateprofile')
      .set('Cookie', [...token])
      .attach('pfp', `${__dirname}/test-pfp.jpg`)
      .field({
        grade: 10,
        interests: ['Computer Science', 'Golf'],
        replacedInterests: userWithCommonInterests.interests.slice(0, 2),
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    expect(response.body.grade).toBe(10);
    expect(response.body.interests).toEqual(
      expect.arrayContaining(['Computer Science', 'Golf', 'Tennis'])
    );
    expect(response.body.school.formattedName).toBe('Princeton High School');
  });

  it('Should add social media info to the test user', async () => {
    const response = await request(app)
      .patch('/api/users/addsocialmedia')
      .set('Cookie', [...token])
      .send({ snapchat: 'rnaini', instagram: 'codernaini' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.socialMediaUsernames.snapchat).toBe('rnaini');
    expect(response.body.socialMediaUsernames.instagram).toBe('codernaini');
  });
});

describe('SEARCH /users', () => {
  let firstNameQuery;
  let lastNameQuery;
  it('Should find the first user name by querying their firstname', async () => {
    const { firstName, lastName } = {
      firstName: fakeUsers[0].firstName,
      lastName: fakeUsers[0].lastName,
    };
    firstNameQuery = firstName;
    lastNameQuery = lastName;

    const response = await request(app)
      .get(`/api/users/search/${firstName.slice(0, 2)}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body.map((item) => item.firstName)).toContain(firstName);
    expect(response.body[0].school.schoolId).toBe(userInfo.school.schoolId);
  });

  it('Should find the first user name by querying their lastname', async () => {
    const response = await request(app)
      .get(`/api/users/search/${lastNameQuery.slice(0, 2)}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body.map((item) => item.lastName)).toContain(lastNameQuery);
    expect(response.body[0].school.schoolId).toBe(userInfo.school.schoolId);
  });

  it('Should find a user by querying their fullname', async () => {
    const response = await request(app)
      .get(`/api/users/search/${firstNameQuery}${lastNameQuery.slice(0, 2)}`)
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(
      response.body.map((item) => `${item.firstName} ${item.lastName}`)
    ).toContain(`${firstNameQuery} ${lastNameQuery}`);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
