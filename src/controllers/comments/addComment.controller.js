const { isValidObjectId } = require('mongoose');
const { Comment } = require('../../models/comment.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
  }

  // validation - not empty
  if (!content) {
    throw new ApiError(400, 'All fields are required');
  }

  // create comment object - create entry in DB
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  // check that comment saved in the DB
  const createdComment = await Comment.findById(comment._id);

  // check for user creation
  if (!createdComment) {
    throw new ApiError(500, 'Something went wrong while adding the comment');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, 'Comment Added Successfully'));
});

module.exports = addComment;
