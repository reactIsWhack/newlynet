const userErrorHandler = (err, req, res, next) => {
  if (err.errors && err.errors.firstName) {
    return res.status(400).json({
      message: err.errors.firstName.properties.message,
      stack: err.stack,
    });
  }

  if (err.errors && err.errors.lastName) {
    return res.status(400).json({
      message: err.errors.lastName.properties.message,
      stack: err.stack,
    });
  }

  if (err.errors && err.errors.username) {
    return res.status(400).json({
      message: err.errors.username.properties.message,
      stack: err.stack,
    });
  }

  if (err.errors && err.errors.password) {
    return res.status(400).json({
      message: err.errors.password.properties.message,
      stack: err.stack,
    });
  }

  if (err.errors && err.errors.school) {
    return res.status(400).json({
      message: err.errors.school.properties.message,
      stack: err.stack,
    });
  }

  if (err.errors && err.errors.grade) {
    return res.status(400).json({
      message: err.errors.grade.properties.message,
      stack: err.stack,
    });
  }

  // If username is not unique (username has already been registered)

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'User with username already registered, please login',
      stack: err.stack,
    });
  }

  // For other operational errors that are thrown or internal server errors
  res
    .status(res.statusCode || 500)
    .json({ message: err.message, stack: err.stack });
};

module.exports = userErrorHandler;
