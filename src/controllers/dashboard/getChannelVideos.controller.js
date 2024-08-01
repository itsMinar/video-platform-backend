const { Types } = require('mongoose');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: '_id',
        foreignField: 'owner',
        as: 'video_list',
        pipeline: [
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'video',
              as: 'comment_list',
            },
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'video',
              as: 'like_list',
            },
          },
          {
            $addFields: {
              totalComments: { $size: '$comment_list' },
              totalLikes: { $size: '$like_list' },
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              duration: 1,
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              totalComments: 1,
              totalLikes: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalVideos: { $size: '$video_list' },
      },
    },
    {
      $project: {
        totalVideos: 1,
        video_list: 1,
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, videos[0], 'Channel Videos Fetched Successfully')
    );
});

module.exports = getChannelVideos;
