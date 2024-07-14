const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video Details fetched Successfully'));
});

module.exports = getVideoById;
