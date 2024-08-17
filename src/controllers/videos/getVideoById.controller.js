const { isValidObjectId } = require('mongoose');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Video ID'],
      hints: 'Please check the Video ID and try again.',
    });

    return next(error);
  }

  const video = await Video.findById(videoId).populate(
    'owner',
    'fullName avatar username'
  );

  if (!video) {
    const error = CustomError.notFound({
      message: 'Video not found',
      errors: ['The specified video could not be found.'],
      hints: 'Please check the video ID and try again.',
    });

    return next(error);
  }

  // TODO: fetch similar videos based on the title to suggest that video player page

  // increase view count
  video.views++;

  await video.save();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video Details fetched Successfully'));
});

module.exports = getVideoById;
