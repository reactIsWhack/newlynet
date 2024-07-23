const mongoose = require('mongoose');

const connectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on('connected', async () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};

module.exports = connectToDB;
