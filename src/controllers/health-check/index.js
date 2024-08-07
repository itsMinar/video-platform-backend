const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Everything is Ok'));
});

module.exports = { healthCheck };
