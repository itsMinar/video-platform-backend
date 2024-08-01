const { Types } = require('mongoose');
const { Like } = require('../../models/like.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'video',
        foreignField: '_id',
        as: 'videoDetails',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'ownerInfo',
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              ownerInfo: { $arrayElemAt: ['$ownerInfo', 0] },
            },
          },
          {
            $project: {
              title: 1,
              duration: 1,
              description: 1,
              views: 1,
              thumbnail: 1,
              ownerInfo: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videoDetails: { $arrayElemAt: ['$videoDetails', 0] },
      },
    },
    {
      $project: {
        videoDetails: 1,
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, 'Fetched all Liked Videos Successfully')
    );
});

module.exports = getLikedVideos;
