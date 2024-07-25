const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const toggleCommentLike = asyncHandler(async (req, res) => {
  // return response
  return res.status(201).json(new ApiResponse(201, null, 'Successfully'));
});

module.exports = toggleCommentLike;