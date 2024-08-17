const { isValidObjectId } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { Tweet } = require('../../models/tweet.model');
const CustomError = require('../../utils/Error');

const deleteTweet = asyncHandler(async (req, res, next) => {
  const { tweetId } = req.params;

  // check valid tweetId
  if (!isValidObjectId(tweetId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Tweet ID'],
      hints: 'Please check the Tweet ID and try again',
    });

    return next(error);
  }

  // find tweet by the Tweet ID from DB
  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    const error = CustomError.notFound({
      message: 'Tweet not found',
      errors: ['The specified tweet could not be found.'],
      hints: 'Please check the tweet ID and try again',
    });

    return next(error);
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Tweet Deleted Successfully'));
});

module.exports = deleteTweet;
