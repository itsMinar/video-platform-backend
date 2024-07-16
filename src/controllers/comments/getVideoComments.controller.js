const mongoose = require('mongoose');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Comment } = require('../../models/comment.model');

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const allComments = await Comment.find();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, allComments, 'Comments Fetched Successfully'));
});

module.exports = getVideoComments;
