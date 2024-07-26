const cors = require('cors');
const { config } = require('dotenv');
const connectToDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const chatsRouter = require('./routes/chats.route');
const messageRouter = require('./routes/message.route');
const express = require('express');
const { server } = require('./socket/socket');
const userErrorHandler = require('./middleware/userErrorHandler');
const chatsErrorHandler = require('./controllers/chatsErrorHandler');
config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter, userErrorHandler);
app.use('/api/users', userRouter, userErrorHandler);
app.use('/api/chats', chatsRouter, chatsErrorHandler);
app.use('/api/chats', messageRouter);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  if (process.env.NODE_ENV !== 'test') connectToDB();
});

module.exports = app;
