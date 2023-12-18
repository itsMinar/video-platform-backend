const { User } = require('../models/user.model.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

const generateAccessAndrefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating access and refresh token.'
    );
  }
};

// User Register Controller
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, email, username, password } = req.body;

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // create user object - create entry in DB
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Registered Successfully'));
});

// User Login Controller
const loginUser = asyncHandler(async (req, res) => {
  // get data from req body
  const { username, email, password } = req.body;

  // validation check - email or username
  if (!email || !username) {
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

// User Logout Controller
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out.'));
});

module.exports = { registerUser, loginUser, logoutUser };
