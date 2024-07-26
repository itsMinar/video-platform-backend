const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId } = require('mongoose');
const { User } = require('../../models/user.model');
const { Tweet } = require('../../models/tweet.model');

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: aro onek kaj baki ache, bivinno query add korte hobe
  const { userId } = req.params;

  // check valid userId
  if (!isValidObjectId(userId)) {
    throw new ApiError(404, 'Invalid User ID');
  }

  const user = await User.findById(userId).select('username');

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  const allTweets = await Tweet.find({ owner: userId });

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, allTweets, 'All Tweets Fetched Successfully'));
});

module.exports = getUserTweets;
