const cors = require('cors');
const { config } = require('dotenv');
const connectToDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const chatsRouter = require('./routes/chats.route');
const messageRouter = require('./routes/message.route');
const express = require('express');
const { server, io, app } = require('./socket/socket');
const userErrorHandler = require('./middleware/userErrorHandler');
const { generateFakeUsers } = require('./utils/seeds');
config();

// const app = express();

const PORT = process.env.PORT;
console.log(process.env.CLIENT_URL);

app.get('/', (req, res) => {
  res.send('Default Route');
});

app.use(express.json());
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter, userErrorHandler);
app.use('/api/users', userRouter, userErrorHandler);
app.use('/api/chats', chatsRouter, userErrorHandler);
app.use('/api/message', messageRouter, userErrorHandler);

server.listen(process.env.PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  if (process.env.NODE_ENV !== 'test') {
    await connectToDB();
    // await generateFakeUsers();
  }
});

module.exports = app;
