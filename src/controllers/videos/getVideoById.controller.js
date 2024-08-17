const { isValidObjectId } = require('mongoose');
const { Video } = require('../../models/video.model');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Video ID'],
      hints: 'Please check the Video ID and try again',
    });

    return next(error);
  }

  const video = await Video.findById(videoId).populate(
    'owner',
    'fullName avatar username'
  );

  if (!video) {
    const error = CustomError.notFound({
      message: 'Video not found',
      errors: ['The specified video could not be found.'],
      hints: 'Please check the video ID and try again',
    });

    return next(error);
  }

  // Fetch similar videos based on the title
  const similarVideos = await Video.find({
    _id: { $ne: videoId },
    $or: [
      { title: { $regex: new RegExp(video.title.split(' ').join('|'), 'i') } }, // Split title into words and match any
    ],
  })
    .populate('owner', 'fullName username')
    .limit(5);

  // TODO: fix the issue about how can i get the userId from request
  // Add the videoId to the user's watchHistory
  if (req?.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: videoId },
    });
  }

  // increase view count
  video.views++;

  await video.save();

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video, similarVideos },
        'Video Details fetched Successfully'
      )
    );
});

module.exports = getVideoById;
