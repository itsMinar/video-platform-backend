const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const clearWatchHistory = asyncHandler(async (req, res) => {
  const clearedHistory = await User.findByIdAndUpdate(
    req?.user?._id,
    { watchHistory: [] },
    { new: true }
  ).select('fullName username watchHistory');

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        clearedHistory,
        'Watch History Cleared Successfully.'
      )
    );
});

module.exports = clearWatchHistory;
