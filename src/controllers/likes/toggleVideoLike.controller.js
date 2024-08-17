const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Like } = require('../../models/like.model');
const CustomError = require('../../utils/Error');

const toggleVideoLike = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.notFound({
      message: 'Invalid Video ID',
      errors: ['The specified Video ID does not match any records.'],
      hints: 'Please check the Video ID and try again.',
    });

    return next(error);
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
    const error = CustomError.serverError({
      message: 'Something went wrong while liking the video',
      errors: [
        'The system encountered an issue while processing your like request.',
      ],
      hints: 'Please try again later',
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdLike, 'Like the Video Successfully'));
});

module.exports = toggleVideoLike;
