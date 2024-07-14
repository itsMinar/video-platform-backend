const { Video } = require('../../models/video.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You Can not Update this Video!');
  }

  const videoThumbnailLocalPath = req.file?.path;

  if (!videoThumbnailLocalPath) {
    throw new ApiError(400, 'Video Thumbnail is required');
  }

  // upload them to cloudinary
  const videoThumbnail = await uploadOnCloudinary(videoThumbnailLocalPath);

  if (!videoThumbnail.url) {
    throw new ApiError(400, 'Error while uploading the Video Thumbnail');
  }

  if (title) {
    video.title = title;
  }

  if (description) {
    video.description = description;
  }

  video.thumbnail = videoThumbnail.url;

  await video.save();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video Details Updated Successfully'));
});

module.exports = updateVideo;
