const mongoose = require('mongoose');
const { populateDB } = require('../utils/seeds');
const ClubChat = require('../models/clubChat.model');

const connectToDB = async () => {
  mongoose.connection.on('connected', async () => {
    console.log('Connected to MongoDB');
    // await populateDB();
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => console.log('disconnected'));

  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectToDB;
