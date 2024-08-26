const { isValidObjectId, Types } = require('mongoose');
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

  // Fetch the video details by aggregation pipeline
  const result = await Video.aggregate([
    { $match: { _id: new Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'video',
        as: 'liker_list',
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner_info',
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ['$owner_info', 0] },
        totalLikes: { $size: '$liker_list' },
        likers: '$liker_list',
      },
    },
    {
      $project: {
        owner_info: 0,
        liker_list: 0,
      },
    },
  ]);

  // Extract the video details from the aggregation result
  const video = result[0];

  if (!video) {
    const error = CustomError.notFound({
      message: 'Video not found',
      errors: ['The specified video could not be found.'],
      hints: 'Please check the video ID and try again',
    });

    return next(error);
  }

  // Fetch similar videos based on title
  const similarVideos = await Video.find({
    _id: { $ne: videoId },
    $or: [
      { title: { $regex: new RegExp(video.title.split(' ').join('|'), 'i') } },
    ],
  })
    .select('videoFile thumbnail title views createdAt')
    .populate('owner', 'fullName username')
    .limit(5);

  // TODO: fix the issue about how can i get the userId from request
  // Add the videoId to the user's watchHistory
  if (req?.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: videoId },
    });
  }

  // Increase the view count
  await Video.updateOne({ _id: video._id }, { $inc: { views: 1 } });

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
