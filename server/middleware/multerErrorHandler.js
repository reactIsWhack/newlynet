const fileErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};

module.exports = fileErrorHandler;
