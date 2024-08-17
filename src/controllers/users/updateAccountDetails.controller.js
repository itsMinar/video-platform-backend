const { z } = require('zod');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    fullName: z
      .string({ message: 'fullName is Required' })
      .min(2, 'fullName must be at least 2 characters')
      .optional(),
    email: z
      .string({ message: 'email is Required' })
      .email({ message: 'Invalid email format' })
      .optional(),
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

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    validation.data,
    { new: true }
  ).select('-password');

  // return a Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'Account Details Updated Successfully')
    );
});

module.exports = updateAccountDetails;
