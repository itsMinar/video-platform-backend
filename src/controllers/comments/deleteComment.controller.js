const { Comment } = require('../../models/comment.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // validation - not empty
  if (!commentId) {
    throw new ApiError(400, 'Comment ID is required');
  }

  // find comment by the Comment ID from DB
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, 'Comment not found!');
  }

  // delete comment from the DB
  await comment.deleteOne();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Comment Deleted Successfully'));
});

module.exports = deleteComment;
