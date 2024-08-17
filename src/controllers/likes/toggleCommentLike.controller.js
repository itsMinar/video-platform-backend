const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');
const CustomError = require('../../utils/Error');

const toggleCommentLike = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  // check valid commentId
  if (!isValidObjectId(commentId)) {
    const error = CustomError.notFound({
      message: 'Invalid Comment ID',
      errors: ['The specified Comment ID does not match any records.'],
      hints: 'Please check the Comment ID and try again.',
    });

    return next(error);
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
    const error = CustomError.serverError({
      message: 'Something went wrong while liking the comment',
      errors: [
        'The system encountered an issue while processing your like request.',
      ],
      hints: 'Please try again later',
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdLike, 'Like the Comment Successfully'));
});

module.exports = toggleCommentLike;
