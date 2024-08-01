const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId, Types } = require('mongoose');
const { User } = require('../../models/user.model');
const { Tweet } = require('../../models/tweet.model');

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // check valid userId
  if (!isValidObjectId(userId)) {
    throw new ApiError(404, 'Invalid User ID');
  }

  const user = await User.findById(userId).select('username');

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  const allTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId),
      },
    },
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
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        ownerInfo: {
          $arrayElemAt: ['$ownerInfo', 0],
        },
      },
    },
    {
      $project: {
        content: 1,
        ownerInfo: 1,
      },
    },
  ]);

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, allTweets, 'All Tweets Fetched Successfully'));
});

module.exports = getUserTweets;
