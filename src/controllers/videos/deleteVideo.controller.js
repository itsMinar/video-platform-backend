const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  deleteVideoFromCloudinary,
  deleteImageFromCloudinary,
} = require('../../utils/cloudinary');

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You Can not Delete this Video!');
  }

  // find the thumbnailId and videoId from the video
  const thumbnailIdOfCloudinary = video.thumbnail
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '');
  const videoIdOfCloudinary = video.videoFile
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '');

  // Delete from Cloudinary asynchronously
  const [thumbnailDeletion, videoDeletion] = await Promise.all([
    deleteImageFromCloudinary(thumbnailIdOfCloudinary),
    deleteVideoFromCloudinary(videoIdOfCloudinary),
  ]);

  // Handle potential errors from Cloudinary deletions
  if (
    thumbnailDeletion.deleted[thumbnailIdOfCloudinary] === 'not_found' ||
    videoDeletion.deleted[videoIdOfCloudinary] === 'not_found' ||
    thumbnailDeletion.error ||
    videoDeletion.error
  ) {
    throw new ApiError(500, 'Error Deleting Video from Cloudinary');
  }

  // delete video from DB
  await video.deleteOne();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Video Deleted Successfully'));
});

module.exports = deleteVideo;
