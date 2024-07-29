const chatsErrorHandler = async (err, req, res) => {
  const status = res.statusCode || 500;
  console.log(err.message);

  res.status(status).json({ message: err.message, stack: err.stack });
};

module.exports = chatsErrorHandler;
