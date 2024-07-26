const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { asyncHandler } = require('../../utils/asyncHandler');
const { isValidObjectId } = require('mongoose');
const {
  deleteFromCloudinary,
  getCloudinaryId,
} = require('../../utils/cloudinary');

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
  }

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (!video) {
    throw new ApiError(404, 'Video not Found.');
  }

  if (video.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, 'You Can not Delete this Video!');
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
