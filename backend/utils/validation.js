const { validationResult } = require('express-validator');
const { environment } = require('../config');
const isProduction = environment === 'production';

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);
    if (!isProduction) {
      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    } else {
      const err = Error("Bad request.");
      err.errors = {
        message: "Bad Request",
        errors: errors
      }
      next(err)
    }
  }

  next();
};

module.exports = {
  handleValidationErrors
};
