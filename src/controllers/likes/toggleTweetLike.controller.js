const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');
const CustomError = require('../../utils/Error');

const toggleTweetLike = asyncHandler(async (req, res, next) => {
  const { tweetId } = req.params;

  // check valid tweetId
  if (!isValidObjectId(tweetId)) {
    const error = CustomError.notFound({
      message: 'Invalid Tweet ID',
      errors: ['The specified Tweet ID does not match any records.'],
      hints: 'Please check the Tweet ID and try again.',
    });

    return next(error);
  }

  // search the tweet that already liked or not
  const alreadyLikedTweet = await Like.findOne({
    $and: [{ likedBy: req.user._id }, { tweet: tweetId }],
  });

  if (alreadyLikedTweet) {
    await alreadyLikedTweet.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Unlike the Tweet Successfully'));
  }

  // create like object - create entry in DB
  const like = await Like.create({
    likedBy: req.user._id,
    tweet: tweetId,
  });

  // check that like saved in the DB
  const createdLike = await Like.findById(like._id);

  if (!createdLike) {
    const error = CustomError.serverError({
      message: 'Something went wrong while liking the tweet',
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
    .json(new ApiResponse(201, createdLike, 'Like the Tweet Successfully'));
});

module.exports = toggleTweetLike;
