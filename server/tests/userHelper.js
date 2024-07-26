const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

const loginUser = async (username, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  return { token: response.headers['set-cookie'], user: response.body };
};

const createTestUser = async (interests, school) => {
  const user = await User.create({
    fullName: 'test jest',
    username: 'test',
    password: 'test123',
    grade: 9,
    school,
    interests,
    contacts: [],
  });
  return user;
};

const addContacts = async (token, contactId) => {
  const response = await request(app)
    .patch(`/api/users/addcontact/${contactId}`)
    .set('Cookie', [...token]);

  return response.body.contacts;
};

module.exports = { loginUser, createTestUser, addContacts };
