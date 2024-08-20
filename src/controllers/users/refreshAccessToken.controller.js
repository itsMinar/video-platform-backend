const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.model');
const { asyncHandler } = require('../../utils/asyncHandler');
const generateAccessAndrefreshTokens = require('../../services/generateAccessAndrefreshTokens');
const { ApiResponse } = require('../../utils/ApiResponse');
const CustomError = require('../../utils/Error');

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    const error = CustomError.unauthorized({
      message: 'Unauthorized request',
      errors: ['Refresh token is missing or invalid.'],
      hints: 'Please provide a valid refresh token and try again',
    });

    return next(error);
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select('refreshToken');

    if (!user) {
      const error = CustomError.unauthorized({
        message: 'Invalid Refresh Token',
        errors: ['No user found with the provided refresh token.'],
        hints: 'Please check the refresh token and try again',
      });

      return next(error);
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      const error = CustomError.unauthorized({
        message: 'Refresh Token is Expired or Used',
        errors: [
          'The provided refresh token is either expired or has already been used.',
        ],
        hints:
          'Please provide a valid refresh token or obtain a new one and try again',
      });

      return next(error);
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndrefreshTokens(
      user._id
    );

    // return a Response
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          'Access Token Refreshed.'
        )
      );
  } catch (err) {
    const error = CustomError.unauthorized({
      message: err?.message || 'Invalid Refresh Token',
      errors: [err?.message || 'The refresh token provided is invalid.'],
      hints: 'Please provide a valid refresh token and try again',
    });

    return next(error);
  }
});

module.exports = refreshAccessToken;
