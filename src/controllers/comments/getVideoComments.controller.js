const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Comment } = require('../../models/comment.model');
const { isValidObjectId, Types } = require('mongoose');

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check valid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid Video ID');
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
