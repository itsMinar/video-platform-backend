const { Types } = require('mongoose');
const { User } = require('../../models/user.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getChannelStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscriber_list',
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
              commentCount: { $size: '$comment_list' },
              likeCount: { $size: '$like_list' },
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              videoFile: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              likeCount: 1,
              commentCount: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalSubscribers: { $size: '$subscriber_list' },
        totalVideos: { $size: '$video_list' },
        highest_viewed_video: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$video_list',
                as: 'video',
                cond: { $eq: ['$$video.views', { $max: '$video_list.views' }] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $unwind: '$video_list',
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        fullName: { $first: '$fullName' },
        avatar: { $first: '$avatar' },
        totalSubscribers: { $first: '$totalSubscribers' },
        totalVideos: { $first: '$totalVideos' },
        highestViewedVideo: { $first: '$highest_viewed_video' },
        totalViews: { $sum: '$video_list.views' },
        totalLikes: { $sum: '$video_list.likeCount' },
        totalComments: { $sum: '$video_list.commentCount' },
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, stats[0], 'Channel Stats Fetched Successfully'));
});

module.exports = getChannelStats;
