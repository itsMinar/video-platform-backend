const { z } = require('zod');
const { User } = require('../../models/user.model');
const generateAccessAndrefreshTokens = require('../../services/generateAccessAndrefreshTokens');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const loginUser = asyncHandler(async (req, res, next) => {
  // Define user schema for login
  const schema = z
    .object({
      email: z
        .string({ message: 'email is Required' })
        .email({ message: 'Invalid email format' })
        .optional(),
      username: z.string({ message: 'username is required' }).optional(),
      password: z
        .string({ message: 'password is required' })
        .min(6, 'password must be at least 6 characters'),
    })
    .refine((data) => data.username || data.email, {
      message: 'Either username or email is required',
      path: ['username', 'email'],
    });

  // Perform validation using the schema
  const validation = schema.safeParse(req.body);

  // If validation fails, throw a 400 Bad Request error
  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // Find the user by username or email
  const user = await User.findOne({
    $or: [
      { username: validation.data.username },
      { email: validation.data.email },
    ],
  });

  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['No user found with the provided email or username'],
      hints: 'Please check the email or username and try again',
    });

    return next(error);
  }

  // Validate the provided password against the stored password
  const isPasswordValid = await user.isPasswordCorrect(
    validation.data.password
  );

  // If password is incorrect, throw a 401 Unauthorized error
  if (!isPasswordValid) {
    const error = CustomError.unauthorized({
      message: 'Invalid user credentials',
      errors: ['The provided email/username or password is incorrect.'],
      hints: 'Please check your credentials and try again.',
    });

    return next(error);
  }

  // Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAccessAndrefreshTokens(
    user._id
  );

  // Fetch the updated user information, excluding password and refreshToken
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // create options for security that it can only changeable from server
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
