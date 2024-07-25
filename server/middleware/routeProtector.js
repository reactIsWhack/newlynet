const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const routeProtector = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (!verified) {
    return res.status(401).json({ message: 'Invalid token - Please login' });
  }

  const user = await User.findById(verified.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found - Please login' });
  }

  req.userId = user._id;
  next();
};

module.exports = routeProtector;
