const { User } = require('../models/user.model.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

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
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Local Avatar file is required');
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

module.exports = { registerUser };
