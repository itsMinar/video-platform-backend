const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { isValidObjectId } = require('mongoose');
const {
  deleteFromCloudinary,
  getCloudinaryId,
} = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Video ID'],
      hints: 'Please check the Video ID and try again',
    });

    return next(error);
  }

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (!video) {
    const error = CustomError.notFound({
      message: 'Video not found',
      errors: ['The specified video could not be found.'],
      hints: 'Please check the video ID and try again',
    });

    return next(error);
  }

  if (video.owner._id.toString() !== req.user._id.toString()) {
    const error = CustomError.badRequest({
      message: 'You cannot delete this video!',
      errors: ['The video you are trying to delete does not belong to you.'],
      hints: 'Please check the video ownership and try again',
    });

    return next(error);
  }

  // find the thumbnailId and videoId from the video
  const thumbnailIdOfCloudinary = getCloudinaryId(video.thumbnail);
  const videoIdOfCloudinary = getCloudinaryId(video.videoFile);

  // Delete from Cloudinary asynchronously
  const [thumbnailDeletion, videoDeletion] = await Promise.all([
    deleteFromCloudinary(thumbnailIdOfCloudinary, 'image'),
    deleteFromCloudinary(videoIdOfCloudinary, 'video'),
  ]);

  // Handle potential errors from Cloudinary deletions
  if (
    thumbnailDeletion.deleted[thumbnailIdOfCloudinary] === 'not_found' ||
    videoDeletion.deleted[videoIdOfCloudinary] === 'not_found' ||
    thumbnailDeletion.error ||
    videoDeletion.error
  ) {
    const error = CustomError.serverError({
      message: 'Error Deleting Video from Cloudinary',
      errors: [
        'An error occurred while trying to delete the video from Cloudinary.',
      ],
    });

    return next(error);
  }

  // delete video from DB
  await video.deleteOne();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Video Deleted Successfully'));
});

module.exports = deleteVideo;
