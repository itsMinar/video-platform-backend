const { Video } = require('../../models/video.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');

const uploadVideo = asyncHandler(async (req, res) => {
  // get video details from client
  const { title, description } = req.body;

  // validation - not empty
  if ([title, description].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  // check for video file
  const videoFileLocalPath = req.files?.videoFile[0]?.path;

  let videoThumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.videoThumbnail) &&
    req.files.videoThumbnail.length > 0
  ) {
    videoThumbnailLocalPath = req.files.videoThumbnail[0].path;
  }

  if (!videoFileLocalPath) {
    throw new ApiError(400, 'Video file is required');
  }

  if (!videoThumbnailLocalPath) {
    throw new ApiError(400, 'Video Thumbnail is required');
  }

  // upload them to cloudinary
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const videoThumbnail = await uploadOnCloudinary(videoThumbnailLocalPath);

  if (!videoFile || !videoThumbnail) {
    throw new ApiError(400, 'Video file and Thumbnail is required');
  }

  // create video object - create entry in DB
  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    duration: videoFile.duration,
    thumbnail: videoThumbnail.url,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  // check for user creation
  if (!createdVideo) {
    throw new ApiError(500, 'Something went wrong while uploading the video');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, 'Video Uploaded Successfully'));
});

module.exports = uploadVideo;
