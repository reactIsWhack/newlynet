const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');

const loginUser = async (username, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return { token: response.headers['set-cookie'], user: response.body };
};

const getFakeUsers = async () => {
  const fakeUsers = await User.find();
  return fakeUsers;
};

module.exports = { loginUser, getFakeUsers };
