const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getChannelStats = asyncHandler(async (req, res) => {
  // return response
  return res.status(200).json(new ApiResponse(200, null, 'Stats Successfully'));
});

module.exports = getChannelStats;
