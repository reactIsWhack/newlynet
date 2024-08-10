const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  generateFakeUsers,
  generateClubChats,
  populateDB,
} = require('../utils/seeds');

let mongoServer;

const initializeMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    dbName: process.env.NODE_ENV === 'test' ? 'NodeNetTest' : 'NodeNet',
  });

  await populateDB();
};

const disconnectMongoDB = async () => {
  await mongoServer.stop();
};

module.exports = { initializeMongoDB, disconnectMongoDB };
