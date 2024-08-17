const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const updateUserCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    const error = CustomError.badRequest({
      message: 'Cover image is required',
      errors: ['No cover image was provided in the request.'],
      hints: 'Please upload a cover image and try again.',
    });

    return next(error);
  }

  // upload them to cloudinary, avatar
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    const error = CustomError.serverError({
      message: 'Error while uploading the Cover Image',
      errors: ['An error occurred during the Cover Image upload process.'],
    });

    return next(error);
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
    const error = CustomError.serverError({
      message: 'Error Deleting Cover Image from Cloudinary',
      errors: [
        'An error occurred while trying to delete the cover image from Cloudinary.',
      ],
    });

    return next(error);
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
