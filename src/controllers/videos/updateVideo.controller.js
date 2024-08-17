const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');

const updateVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  const schema = z.object({
    videoId: z
      .string({ message: 'Video ID is required' })
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Video ID',
      }),
    title: z.string({ message: 'Video title is required' }).optional(),
    description: z
      .string({ message: 'Tweet content is required' })
      .min(4, 'Tweet content must be at least 4 characters')
      .optional(),
  });

  const validation = schema.safeParse({ ...req.body, videoId });

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const video = await Video.findById(videoId).populate('owner', 'fullName');

  if (video.owner._id.toString() !== req.user._id.toString()) {
    const error = CustomError.badRequest({
      message: 'You cannot Update this video!',
      errors: ['The video you are trying to Update does not belong to you.'],
      hints: 'Please check the video ownership and try again.',
    });

    return next(error);
  }

  const videoThumbnailLocalPath = req.file?.path;

  if (!videoThumbnailLocalPath) {
    const error = CustomError.badRequest({
      message: 'Video Thumbnail is required',
      errors: ['No video thumbnail was provided in the request.'],
      hints: 'Please upload a video thumbnail and try again.',
    });

    return next(error);
  }

  // upload them to cloudinary
  const videoThumbnail = await uploadOnCloudinary(videoThumbnailLocalPath);

  if (!videoThumbnail.url) {
    const error = CustomError.serverError({
      message: 'Error while uploading the Video Thumbnail',
      errors: ['An error occurred during the video thumbnail upload process.'],
      hints: 'Please try again later',
    });

    return next(error);
  }

  if (validation.data.title) {
    video.title = validation.data.title;
  }

  if (validation.data.description) {
    video.description = validation.data.description;
  }

  video.thumbnail = videoThumbnail.url;

  await video.save();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video Details Updated Successfully'));
});

module.exports = updateVideo;
