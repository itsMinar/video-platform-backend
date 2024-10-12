const { ZodError } = require('zod');
const CustomError = require('../utils/Error');
const logger = require('../logger/winston.logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error('Call the Error Middleware');

  const errorMessage =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong!';

  let error = {
    message: errorMessage,
    errors:
      Array.isArray(err.errors) && err.errors.length
        ? err.errors
        : ['Server Error!'],
    hints: err.hints,
  };

  // Check if the error is an instance of CustomError
  if (err instanceof CustomError) {
    error = {
      ...error,
    };
  }

  // Check if the error is an instance of ValidationError
  if (err instanceof ZodError) {
    error = {
      ...error,
      errors: err.errors.map((e) => e.message),
      // status: 422,
    };
  }

  res.status(err.status || 500).json(error);
};

module.exports = errorMiddleware;
