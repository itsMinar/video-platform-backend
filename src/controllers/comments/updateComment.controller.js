const { isValidObjectId } = require('mongoose');
const { Comment } = require('../../models/comment.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { z } = require('zod');

const updateComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const schema = z.object({
    commentId: z
      .string({ message: 'Comment ID is required' })
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Comment ID',
      }),
    content: z.string({ message: 'Comment content is required' }).optional(),
  });

  // validation - not empty
  const validation = schema.safeParse({ ...req.body, commentId });

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // find comment by the Comment ID from DB
  const updatedComment = await Comment.findByIdAndUpdate(
    validation.data.commentId,
    { content: validation.data.content },
    { new: true }
  );

  if (!updatedComment) {
    const error = CustomError.notFound({
      message: 'Comment not found!',
      errors: ['The specified comment could not be located.'],
      hints: 'Please verify the comment ID and try again.',
    });

    return next(error);
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, 'Comment Updated Successfully'));
});

module.exports = updateComment;
