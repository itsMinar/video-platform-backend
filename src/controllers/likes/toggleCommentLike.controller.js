const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // check valid commentId
  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, 'Invalid Comment ID');
  }

  // search the comment that already liked or not
  const alreadyLikedComment = await Like.findOne({
    $and: [{ likedBy: req.user._id }, { comment: commentId }],
  });

  if (alreadyLikedComment) {
    await alreadyLikedComment.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Unlike the Comment Successfully'));
  }

  // create like object - create entry in DB
  const like = await Like.create({
    likedBy: req.user._id,
    comment: commentId,
  });

  // check that like saved in the DB
  const createdLike = await Like.findById(like._id);

  if (!createdLike) {
    throw new ApiError(500, 'Something went wrong while liking the comment');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdLike, 'Like the Comment Successfully'));
});

module.exports = toggleCommentLike;
