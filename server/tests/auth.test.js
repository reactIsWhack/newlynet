const request = require('supertest');
const User = require('../models/user.model');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
// const { app } = require('../socket/socket');
const app = require('../index');
const getSchool = require('../services/schoolService');
const ClubServer = require('../models/clubServer.model');

let school;
let secondSchool;
let token;
beforeAll(async () => {
  await initializeMongoDB();

  school = await getSchool('PrincetonHighSchool');
  console.log(school);
  secondSchool = await getSchool('SouthBrunswickHighSchool');
  console.log(secondSchool);

  await User.create({
    firstName: 'j',
    lastName: 'k',
    username: 'jest',
    password: '123456',
    grade: 9,
    school,
    interests: ['Computer Science'],
  });
});

describe('POST /signup', () => {
  let token;
  it('Should successfully register a user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'test',
        lastName: 'jest',
        username: 'test',
        password: 'testjest',
        grade: 9,
        school,
        interests: ['computer science'],
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    console.log(response.body);
    token = response.headers['set-cookie'];
    expect(response.header['set-cookie']).toBeTruthy(); // ensure the jwt was sent
    expect(response.body.username).toBe('test');
    expect(response.body.grade).toBe(9);
    expect(response.body.school.formattedName).toBe('Princeton High School');
    expect(response.body.interests[0]).toBe('computer science');
  });

  it('Should create a new club server for a new school', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'test',
        lastName: 'jest',
        username: 'testfdasfks',
        password: 'testjest',
        grade: 9,
        school: secondSchool,
        interests: ['computer science'],
      })
      // .expect(201)
      .expect('Content-Type', /application\/json/);
    console.log(response.body);

    const clubServer = await ClubServer.findOne({
      schoolAffiliation: secondSchool.schoolId,
    });
    expect(clubServer.schoolAffiliation).toBe(secondSchool.schoolId);
    expect(clubServer.chats.length).toBe(28);
  });

  it('Should fail to register a user if their password is less than six characters', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'test jest',
        lastName: 'afdsa',
        username: 'test',
        password: '1',
        grade: 9,
        school,
        interests: ['computer science'],
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(
      'Password must be at least 6 characters'
    );
  });

  it('Should fail to register a user if their username already exists', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'test',
        lastName: 'f',
        username: 'jest',
        password: '123456',
        grade: 9,
        school,
        interests: ['computer science'],
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(
      'User with username already registered, please login'
    );
  });

  it('Should fail to register a user if they supply no interests', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'idk',
        lastName: 'f',
        username: 'cool',
        password: '123456',
        grade: 9,
        school,
        interests: [],
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(
      'Please provide at least one club or sport interest'
    );
  });
});

describe('POST /login', () => {
  it('Should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'jest',
        password: '123456',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = response.headers['set-cookie'];
    expect(response.headers['set-cookie']).toBeTruthy();
    expect(response.body._id).toBeTruthy();
    expect(response.body.contacts.length).toBe(0);
  });

  it('Should verify that the user is logged in', async () => {
    const response = await request(app)
      .get('/api/auth/loginstatus')
      .set('Cookie', [...token])
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBe(true);
  });

  it('Should fail to login a user with an incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'jest',
        password: '12345',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Password incorrect');
  });

  it('Should fail to login a user that is not registered', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'dafasdfasfasd',
        password: '12345',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe(
      'User does not exist, please create an account'
    );
  });

  it('Should fail to login a user if no username is given', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: '',
        password: '12345',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Please fill in all fields');
  });
});

describe('AUTH /logout', () => {
  it('Should logout a user', async () => {
    const response = await request(app)
      .get('/api/auth/logout')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(response.headers['set-cookie']);
    expect(response.headers['set-cookie']).toEqual([
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
    expect(response.body.message).toBe('Logged out successfully!');
  });
});

describe('AUTH /routeprotector', () => {
  it('Should block an api route if no token is sent', async () => {
    const response = await request(app)
      .patch('/api/users/addcontact/1')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toBe('Unauthorized - Please login');
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
