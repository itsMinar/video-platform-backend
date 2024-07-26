const { User } = require('../../models/user.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, 'Error while uploading on Avatar');
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
    throw new ApiError(500, 'Error Deleting User Avatar from Cloudinary');
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
