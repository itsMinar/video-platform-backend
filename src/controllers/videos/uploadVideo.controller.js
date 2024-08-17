const { z } = require('zod');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const uploadVideo = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    title: z.string({ message: 'Video title is required' }),
    description: z
      .string({ message: 'Tweet content is required' })
      .min(4, 'Tweet content must be at least 4 characters'),
  });

  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
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
    const error = CustomError.badRequest({
      message: 'Video file is required',
      errors: ['No video file was provided in the request.'],
      hints: 'Please upload a video file and try again',
    });

    return next(error);
  }

  if (!videoThumbnailLocalPath) {
    const error = CustomError.badRequest({
      message: 'Video Thumbnail is required',
      errors: ['No video thumbnail was provided in the request.'],
      hints: 'Please upload a video thumbnail and try again',
    });

    return next(error);
  }

  // upload them to cloudinary
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const videoThumbnail = await uploadOnCloudinary(videoThumbnailLocalPath);

  if (!videoFile || !videoThumbnail) {
    const error = CustomError.badRequest({
      message: 'Video file and Thumbnail are required',
      errors: [
        'Both a video file and a thumbnail are required in the request.',
      ],
      hints:
        'Please ensure that both the video file and the thumbnail are provided and try again',
    });

    return next(error);
  }

  // create video object - create entry in DB
  const video = await Video.create({
    ...validation.data,
    videoFile: videoFile.url,
    duration: videoFile.duration,
    thumbnail: videoThumbnail.url,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  // check for user creation
  if (!createdVideo) {
    const error = CustomError.serverError({
      message: 'Something went wrong while uploading the video',
      errors: ['An error occurred during the video upload process.'],
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, 'Video Uploaded Successfully'));
});

module.exports = uploadVideo;
