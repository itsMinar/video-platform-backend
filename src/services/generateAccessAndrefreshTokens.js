const { User } = require('../models/user.model');
const CustomError = require('../utils/Error');

const generateAccessAndrefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    const error = CustomError.serverError({
      message:
        'Something went wrong while generating access and refresh token.',
      errors: ['Token generation failed due to an internal server error.'],
    });

    return next(error);
  }
};

module.exports = generateAccessAndrefreshTokens;
