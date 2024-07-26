const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // check valid tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(404, 'Invalid Tweet ID');
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
    throw new ApiError(500, 'Something went wrong while liking the tweet');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdLike, 'Like the Tweet Successfully'));
});

module.exports = toggleTweetLike;
