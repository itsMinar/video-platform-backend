const CustomError = require('./Error');

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      const error = CustomError.serverError(err);
      next(error);
    });
  };
};

module.exports = { asyncHandler };
