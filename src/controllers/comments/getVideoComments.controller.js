const { isValidObjectId, Types } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Comment } = require('../../models/comment.model');
const CustomError = require('../../utils/Error');

const getVideoComments = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Video ID'],
      hints: 'Please check the Video ID and try again',
    });

    return next(error);
  }

  const comments = await Comment.aggregate([
    { $match: { video: new Types.ObjectId(videoId) } },
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
        totalLikes: { $size: '$liker_list' },
        commenter: { $arrayElemAt: ['$commenter_list', 0] },
      },
    },
    {
      $project: {
        content: 1,
        totalLikes: 1,
        liker_list: 1,
        commenter: 1,
        createdAt: 1,
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
