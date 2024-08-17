const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    const error = CustomError.badRequest({
      message: 'Avatar is required',
      errors: ['No avatar was provided in the request.'],
      hints: 'Please upload a avatar and try again.',
    });

    return next(error);
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    const error = CustomError.serverError({
      message: 'Error while uploading the avatar',
      errors: ['An error occurred during the avatar upload process.'],
    });

    return next(error);
  }

  // find the avatarId from the user avatar url
  const avatarIdOfCloudinary = getCloudinaryId(req.user?.avatar);

  // Delete from Cloudinary
  const avatarDeletion = await deleteFromCloudinary(
    avatarIdOfCloudinary,
    'image'
  );

  // Handle potential errors from Cloudinary deletions
  if (
    avatarDeletion.deleted[avatarIdOfCloudinary] === 'not_found' ||
    avatarDeletion.error
  ) {
    const error = CustomError.serverError({
      message: 'Error Deleting avatar from Cloudinary',
      errors: [
        'An error occurred while trying to delete the avatar from Cloudinary.',
      ],
    });

    return next(error);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select('-password');

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar Updated Successfully'));
});

module.exports = updateUserAvatar;
