const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Comment } = require('../../models/comment.model');
const { isValidObjectId } = require('mongoose');

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
  }

  // TODO: do it properly

  const allComments = await Comment.find();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, allComments, 'Comments Fetched Successfully'));
});

module.exports = getVideoComments;
