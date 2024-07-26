const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getChannelVideos = asyncHandler(async (req, res) => {
  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Videos Successfully'));
});

module.exports = getChannelVideos;
