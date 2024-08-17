const { z } = require('zod');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const registerUser = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    fullName: z
      .string({ message: 'fullName is Required' })
      .min(2, 'fullName must be at least 2 characters'),
    email: z
      .string({ message: 'email is Required' })
      .email({ message: 'Invalid email format' }),
    username: z.string({ message: 'username is required' }),
    password: z
      .string({ message: 'password is required' })
      .min(6, 'password must be at least 6 characters'),
  });

  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [
      { username: validation.data.username },
      { email: validation.data.email },
    ],
  });

  if (existedUser) {
    const error = CustomError.conflict({
      message: 'Resource Conflict',
      errors: ['User with email or username already exists'],
      hints:
        'Ensure the resource you are trying to create does not already exist.',
    });

    return next(error);
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
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Avatar file is required'],
      hints: 'Please provide the avatar file.',
    });

    return next(error);
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Avatar file is required'],
      hints: 'Please provide the avatar file.',
    });

    return next(error);
  }

  // create user object - create entry in DB
  const user = await User.create({
    ...validation.data,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // check for user creation
  if (!createdUser) {
    const error = CustomError.serverError({
      message: 'Something went wrong while registering the user',
      errors: ['User creation failed. Please try again later.'],
      hints: 'If the problem persists, please contact our support team.',
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User Registered Successfully'));
});

module.exports = registerUser;
