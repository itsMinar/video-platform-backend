const { Comment } = require('../../models/comment.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  // validation - not empty
  if (!content || !commentId) {
    throw new ApiError(400, 'All fields are required');
  }

  // find comment by the Comment ID from DB
  const comment = await Comment.findById(commentId).select('content');

  if (!comment) {
    throw new ApiError(400, 'Comment not found!');
  }

  // update the comment object
  comment.content = content;

  // save new comment to the DB
  await comment.save();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment Updated Successfully'));
});

module.exports = updateComment;
