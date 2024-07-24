const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { Subscription } = require('../../models/subscription.model');
const { isValidObjectId } = require('mongoose');

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // check valid channelId
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(404, 'Invalid Channel ID');
  }

  const result = await Subscription.aggregate([
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'subscriber',
        as: 'subscriber_info',
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
        subscriber_info: {
          $first: '$subscriber_info',
        },
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        'User Channel Subscriber List Fetched Successfully'
      )
    );
});

module.exports = getUserChannelSubscribers;
