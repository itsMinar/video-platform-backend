const { User } = require('../../models/user.model');
const { ApiError } = require('../../utils/ApiError');
const { asyncHandler } = require('../../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const generateAccessAndrefreshTokens = require('../../services/generateAccessAndrefreshTokens');
const { ApiResponse } = require('../../utils/ApiResponse');

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select('refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh Token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh Token is Expired or Used');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndrefreshTokens(user._id);

    // return a Response
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          'Access Token Refreshed.'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Refresh Token');
  }
});

module.exports = refreshAccessToken;
