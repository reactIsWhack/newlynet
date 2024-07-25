const request = require('supertest');
const User = require('../models/user.model');
const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
// const { app } = require('../socket/socket');
const app = require('../index');

let school;
beforeAll(async () => {
  await initializeMongoDB();

  const schoolRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=PrincetonHighSchool&types=school&key=${process.env.API_KEY}`
  );
  const { predictions } = await schoolRes.json();
  (school = {
    fullDescription: predictions[0].description,
    formattedName: predictions[0].structured_formatting.main_text,
  }),
    await User.create({
      fullName: 'j',
      username: 'jest',
      password: '123456',
      grade: 9,
      school,
      interests: ['Computer Science'],
    });
});

describe('POST /signup', () => {
  it('Should successfully register a user', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        fullName: 'test jest',
        username: 'test',
        password: 'testjest',
        grade: 9,
        school,
        interests: ['computer science'],
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.header['set-cookie']).toBeTruthy(); // ensure the jwt was sent
    expect(response.body.fullName).toBe('test jest');
    expect(response.body.username).toBe('test');
    expect(response.body.grade).toBe(9);
    expect(response.body.school.formattedName).toBe('Princeton High School');
    expect(response.body.interests[0]).toBe('computer science');
  });

  it('Should fail to register a user if their password is less than six characters', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        fullName: 'test jest',
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
      .post('/api/users/signup')
      .send({
        fullName: 'test jest',
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
      .post('/api/users/signup')
      .send({
        fullName: 'idk',
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

afterAll(async () => {
  await disconnectMongoDB();
});
