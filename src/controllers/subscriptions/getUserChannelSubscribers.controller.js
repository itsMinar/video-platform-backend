const { Types, isValidObjectId } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { Subscription } = require('../../models/subscription.model');
const CustomError = require('../../utils/Error');

const getUserChannelSubscribers = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;

  // check valid channelId
  if (!isValidObjectId(channelId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Channel ID'],
      hints: 'Please check the Channel ID and try again',
    });

    return next(error);
  }

  const subscriberList = await Subscription.aggregate([
    {
      $match: { channel: new Types.ObjectId(channelId) },
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
      $addFields: {
        totalSubscribers: { $size: '$subscribers' },
      },
    },
    {
      $project: {
        _id: 0,
        channelId: '$_id',
        subscribers: 1,
        totalSubscribers: 1,
      },
    },
  ]);

  // Extract the response from aggregation pipeline
  const response = subscriberList[0] ?? {
    subscribers: [],
    totalSubscribers: 0,
    channelId,
  };

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        'User Channel Subscriber List Fetched Successfully'
      )
    );
});

module.exports = getUserChannelSubscribers;
