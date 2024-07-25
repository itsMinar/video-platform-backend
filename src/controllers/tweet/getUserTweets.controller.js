const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: will do this
  const { channelId } = req.params;

  // check valid channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, 'Invalid Channel ID');
  }

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, null, 'Subscribed Channel Info Fetched Successfully')
    );
});

module.exports = getUserTweets;
