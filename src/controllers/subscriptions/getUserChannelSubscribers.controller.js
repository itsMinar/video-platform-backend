const { Types, isValidObjectId } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { Subscription } = require('../../models/subscription.model');

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // check valid channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, 'Invalid Channel ID');
  }

  const subscriberList = await Subscription.aggregate([
    {
      $match: { channel: Types.ObjectId.createFromHexString(channelId) },
    },
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'subscriber',
        as: 'subscriberList',
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
      $unwind: '$subscriberList',
    },
    {
      $group: {
        _id: '$channel',
        subscribers: { $push: '$subscriberList' },
      },
    },
    {
      $project: {
        _id: 0,
        channelId: '$_id',
        subscribers: 1,
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberList[0],
        'User Channel Subscriber List Fetched Successfully'
      )
    );
});

module.exports = getUserChannelSubscribers;
