const { Like } = require('../../models/like.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getLikedVideos = asyncHandler(async (req, res) => {
  // TODO: aro onek kaj baki ache, bivinno query add korte hobe
  const userId = req.user._id;

  const likedVideos = await Like.find({ likedBy: userId })
    .populate('video')
    .select('video');

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, 'Fetched all Liked Videos Successfully')
    );
});

module.exports = getLikedVideos;
