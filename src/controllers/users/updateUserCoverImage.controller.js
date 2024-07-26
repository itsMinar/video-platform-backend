const { User } = require('../../models/user.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, 'Cover Image is required');
  }

  // upload them to cloudinary, avatar
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, 'Error while uploading on Cover Image');
  }

  // find the coverImageId from the user cover image url
  const coverImageIdOfCloudinary = getCloudinaryId(req.user?.coverImage);

  // Delete from Cloudinary
  const coverImageDeletion = await deleteFromCloudinary(
    coverImageIdOfCloudinary,
    'image'
  );

  // Handle potential errors from Cloudinary deletions
  if (
    coverImageDeletion.deleted[coverImageIdOfCloudinary] === 'not_found' ||
    coverImageDeletion.error
  ) {
    throw new ApiError(500, 'Error Deleting Cover Image from Cloudinary');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select('-password');

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Cover Image Updated Successfully'));
});

module.exports = updateUserCoverImage;
