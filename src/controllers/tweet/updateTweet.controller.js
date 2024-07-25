const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId } = require('mongoose');
const { Tweet } = require('../../models/tweet.model');

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  // check valid tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(404, 'Invalid Tweet ID');
  }

  // validation - not empty
  if (!content) {
    throw new ApiError(400, 'All fields are required');
  }

  // find tweet by the Tweet ID from DB
  const tweet = await Tweet.findById(tweetId).select('content');

  if (!tweet) {
    throw new ApiError(400, 'Tweet not found!');
  }

  // update the tweet object
  tweet.content = content;

  // save new tweet to the DB
  await tweet.save();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, 'Tweet Updated Successfully'));
});

module.exports = updateTweet;
