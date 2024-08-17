const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { Video } = require('../../models/video.model');
const { Comment } = require('../../models/comment.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const addComment = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  const schema = z.object({
    content: z.string({ message: 'Comment content is required' }),
    videoId: z
      .string({ message: 'Video ID is required' })
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Video ID',
      }),
  });

  // validation - not empty
  const validation = schema.safeParse({ ...req.body, videoId });

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // Check if the video exists using videoId from the request
  const video = await Video.findById(validation.data.videoId);
  if (!video) {
    const error = CustomError.notFound({
      message: 'Video not found!',
      errors: ['The video associated with this comment does not exist.'],
      hints: 'Please ensure that the video ID is correct and try again',
    });

    return next(error);
  }

  // create comment object - create entry in DB
  const comment = await Comment.create({
    content: validation.data.content,
    video: validation.data.videoId,
    owner: req.user._id,
  });

  // check that comment saved in the DB
  const createdComment = await Comment.findById(comment._id);

  // check for user creation
  if (!createdComment) {
    const error = CustomError.serverError({
      message: 'Something went wrong while adding the comment',
      errors: ['Comment could not be added due to an internal server error.'],
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, 'Comment Added Successfully'));
});

module.exports = addComment;
