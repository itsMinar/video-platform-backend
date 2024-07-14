const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { asyncHandler } = require('../../utils/asyncHandler');

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You Can not Delete this Video!');
  }

  await video.deleteOne();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Video Deleted Successfully'));
});

module.exports = deleteVideo;
