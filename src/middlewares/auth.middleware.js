const { User } = require('../models/user.model');
const { asyncHandler } = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/Error');

const verifyJWT = asyncHandler(async (req, _res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const error = CustomError.unauthorized({
        message: 'Unauthorized request',
        errors: ['Token is required for authentication'],
        hints: 'Please provide a valid token to access this resource.',
      });

      return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      const error = CustomError.unauthorized({
        message: 'Invalid Access Token',
        errors: ['The provided access token is invalid or has expired'],
        hints: 'Please provide a valid access token and try again.',
      });

      return next(error);
    }

    req.user = user;

    next();
  } catch (err) {
    const error = CustomError.unauthorized({
      message: err?.message || 'Invalid Access Token',
      errors: [
        err?.message || 'The provided access token is invalid or has expired',
      ],
      hints: 'Please provide a valid access token and try again.',
    });

    return next(error);
  }
});

module.exports = { verifyJWT };
