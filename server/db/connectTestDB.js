const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const initializeMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    dbName: process.env.NODE_ENV === 'test' ? 'NodeNetTest' : 'NodeNet',
  });

  console.log(`MongoDB successfully connected to ${mongoUri}`);
};

const disconnectMongoDB = async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
};

module.exports = { initializeMongoDB, disconnectMongoDB };
