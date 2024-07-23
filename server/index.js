const { app, server } = require('./socket/socket');
const cors = require('cors');
const { config } = require('dotenv');
const connectToDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
config();

const PORT = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectToDB();
});
