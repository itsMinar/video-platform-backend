const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Comment } = require('../../models/comment.model');
const { isValidObjectId, Types } = require('mongoose');
const CustomError = require('../../utils/Error');

const getVideoComments = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.badRequest({
      message: 'Invalid Video ID',
      errors: ['The provided Video ID is not valid.'],
      hints: 'Please ensure that the Video ID is correct and try again.',
    });

    return next(error);
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'comment',
        as: 'liker_list',
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'commenter_list',
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalLikes: { $size: '$liker_list' },
        commenter: { $arrayElemAt: ['$commenter_list', 0] },
      },
    },
    {
      $project: {
        content: 1,
        totalLikes: 1,
        commenter: 1,
      },
    },
  ]);

  // return a Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, 'Video Comments Fetched Successfully')
    );
});

module.exports = getVideoComments;
