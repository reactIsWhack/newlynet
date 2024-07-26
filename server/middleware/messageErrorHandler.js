const messageErrorHandler = (err, req, res) => {
  if (err.errors && err.errors.message) {
    return res.status(400).json({
      message: err.errors.message.properties.message,
      stack: err.stack,
    });
  }

  res
    .status(res.statusCode || 500)
    .json({ message: err.message, stack: err.stack });
};

module.exports = messageErrorHandler;
