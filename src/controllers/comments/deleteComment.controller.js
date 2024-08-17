const { isValidObjectId } = require('mongoose');
const { Comment } = require('../../models/comment.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  // check valid commentId
  if (!isValidObjectId(commentId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Comment ID'],
      hints: 'Please ensure that the Comment ID is valid and try again',
    });

    return next(error);
  }

  // find and delete the comment by the Comment ID
  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    const error = CustomError.notFound({
      message: 'Comment not found!',
      errors: ['The specified comment could not be located.'],
      hints: 'Please verify the comment ID and try again',
    });

    return next(error);
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Comment Deleted Successfully'));
});

module.exports = deleteComment;
