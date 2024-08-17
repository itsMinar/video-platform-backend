const { isValidObjectId, Types } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { Subscription } = require('../../models/subscription.model');
const CustomError = require('../../utils/Error');

const getSubscribedChannels = asyncHandler(async (req, res, next) => {
  const { subscriberId } = req.params;

  // check valid subscriberId
  if (!isValidObjectId(subscriberId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Subscriber ID'],
      hints: 'Please check the Subscriber ID and try again.',
    });

    return next(error);
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
