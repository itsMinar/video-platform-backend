const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { isValidObjectId, Types } = require('mongoose');
const { User } = require('../../models/user.model');
const { Tweet } = require('../../models/tweet.model');
const CustomError = require('../../utils/Error');

const getUserTweets = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // check valid userId
  if (!isValidObjectId(userId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid User ID'],
      hints: 'Please check the User ID and try again.',
    });

    return next(error);
  }

  const user = await User.findById(userId).select('username');

  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found',
      errors: ['The specified user could not be found.'],
      hints: 'Please check the user ID and try again.',
    });

    return next(error);
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
        ownerInfo: { $arrayElemAt: ['$ownerInfo', 0] },
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
