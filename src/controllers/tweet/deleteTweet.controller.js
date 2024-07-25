const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId } = require('mongoose');
const { Tweet } = require('../../models/tweet.model');

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // check valid tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(404, 'Invalid Tweet ID');
  }

  // find tweet by the Tweet ID from DB
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, 'Tweet not found!');
  }

  // delete tweet from the DB
  await tweet.deleteOne();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Tweet Deleted Successfully'));
});

module.exports = deleteTweet;
