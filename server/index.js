const cors = require('cors');
const { config } = require('dotenv');
const connectToDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const express = require('express');
const { server } = require('./socket/socket');
const userErrorHandler = require('./middleware/userErrorHandler');
config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.use('/api/users', authRouter, userErrorHandler);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  if (process.env.NODE_ENV !== 'test') connectToDB();
});

module.exports = app;
