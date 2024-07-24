const { isValidObjectId } = require('mongoose');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
  }

  const video = await Video.findById(videoId).populate(
    'owner',
    'fullName avatar username'
  );

  // increase view count
  video.views++;

  await video.save();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video Details fetched Successfully'));
});

module.exports = getVideoById;
