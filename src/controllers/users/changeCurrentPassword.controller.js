const { z } = require('zod');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    oldPassword: z
      .string({ message: 'oldPassword is required' })
      .min(6, 'oldPassword must be at least 6 characters'),
    newPassword: z
      .string({ message: 'newPassword is required' })
      .min(6, 'newPassword must be at least 6 characters'),
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

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(
    validation.data.oldPassword
  );

  if (!isPasswordCorrect) {
    const error = CustomError.unauthorized({
      message: 'Invalid Old Password',
      errors: ['The old password provided is incorrect.'],
      hints: 'Please check the old password and try again',
    });

    return next(error);
  }

  user.password = validation.data.newPassword;
  await user.save({ validateBeforeSave: false });

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password Changed Successfully'));
});

module.exports = changeCurrentPassword;
