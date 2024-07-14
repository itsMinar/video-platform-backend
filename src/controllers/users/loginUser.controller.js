const { User } = require('../../models/user.model');
const generateAccessAndrefreshTokens = require('../../services/generateAccessAndrefreshTokens');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const loginUser = asyncHandler(async (req, res) => {
  // get data from req body
  const { username, email, password } = req.body;

  // validation check - email or username
  if (!(email || username)) {
    throw new ApiError(400, 'username or email is required');
  }

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // response for no user found
  if (!user) {
    throw new ApiError(404, 'User does not exist.');
  }

  // validation check - password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndrefreshTokens(
    user._id
  );

  // get the updated user info
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // create options for security that it can only chaneable from server
  const options = {
    httpOnly: true,
    secure: true,
  };

  // return a Response
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User Logged In Successfully.'
      )
    );
});

module.exports = loginUser;
