const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const ioc = require('socket.io-client');

const loginUser = async (username, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  return { token: response.headers['set-cookie'], user: response.body };
};

const createTestUser = async (interests, school) => {
  const user = await User.create({
    firstName: 'test',
    lastName: 'jest',
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

const connectClientSocket = async (userId) => {
  clientSocket = ioc(`http://localhost:${process.env.PORT}`, {
    // connect logged in user to socket io
    query: { userId },
  });
  console.log(clientSocket);

  return clientSocket;
};

const connectContactSockets = async (contactId, i) => {
  const contactSockets = {};
  contactSockets[`contact${i + 1}`] = ioc(
    `http://localhost:${process.env.PORT}`,
    {
      query: { userId: contactId },
    }
  ); // connects the two users who will be part of future chats as an object
  return contactSockets;
};

const joinClubServer = async (clubServerId, jwt) => {
  await request(app)
    .patch(`/api/clubserver/${clubServerId}`)
    .set('Cookie', [...jwt])
    .expect(200)
    .expect('Content-Type', /application\/json/);
};

module.exports = {
  loginUser,
  createTestUser,
  addContacts,
  connectClientSocket,
  connectContactSockets,
  joinClubServer,
};
