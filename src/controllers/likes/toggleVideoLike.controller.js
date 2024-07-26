const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
  }

  // search the video that already liked or not
  const alreadyLikedVideo = await Like.findOne({
    $and: [{ likedBy: req.user._id }, { video: videoId }],
  });

  if (alreadyLikedVideo) {
    await alreadyLikedVideo.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Unlike the Video Successfully'));
  }

  // create like object - create entry in DB
  const like = await Like.create({
    likedBy: req.user._id,
    video: videoId,
  });

  // check that like saved in the DB
  const createdLike = await Like.findById(like._id);

  if (!createdLike) {
    throw new ApiError(500, 'Something went wrong while liking the video');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdLike, 'Like the Video Successfully'));
});

module.exports = toggleVideoLike;
