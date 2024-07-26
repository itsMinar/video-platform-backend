const { isValidObjectId, Types } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { Subscription } = require('../../models/subscription.model');
const { ApiError } = require('../../utils/ApiError');

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // check valid subscriberId
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(404, 'Invalid Subscriber ID');
  }

  const channelList = await Subscription.aggregate([
    {
      $match: { subscriber: Types.ObjectId.createFromHexString(subscriberId) },
    },
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'channel',
        as: 'channelList',
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
      $unwind: '$channelList',
    },
    {
      $group: {
        _id: '$subscriber',
        channelList: { $push: '$channelList' },
      },
    },
    {
      $project: {
        _id: 0,
        subscriberId: '$_id',
        channelList: 1,
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelList[0],
        'User Subscribed Channel List Fetched Successfully'
      )
    );
});

module.exports = getSubscribedChannels;
