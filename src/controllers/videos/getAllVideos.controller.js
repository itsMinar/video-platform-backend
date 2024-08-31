const { Types } = require('mongoose');
const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = 'createdAt',
    sortType = 'desc',
    userId,
  } = req.query;

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);
  const skip = (pageInt - 1) * limitInt;

  // Create a filter object for aggregation
  let match = { isPublished: true };
  if (query) {
    match = { ...match, title: { $regex: query, $options: 'i' } };
  }
  if (userId) {
    match = { ...match, owner: new Types.ObjectId(userId) };
  }

  // Build the aggregation pipeline
  const aggregationPipeline = [
    { $match: match },
    { $sort: { [sortBy]: sortType === 'desc' ? -1 : 1 } },
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
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limitInt }],
      },
    },
    {
      $unwind: {
        path: '$metadata',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        total: '$metadata.total',
        data: 1,
        ownerInfo: 1,
      },
    },
  ];

  const results = await Video.aggregate(aggregationPipeline);
  const result = results[0] || { total: 0, data: [] };

  const totalVideos = result.total;
  const totalPages = Math.ceil(totalVideos / limitInt);

  // Calculate pagination details
  const pagination = {
    page: pageInt,
    limit: limitInt,
    first: 1,
    last: totalPages,
    prev: pageInt > 1 ? pageInt - 1 : null,
    next: pageInt < totalPages ? pageInt + 1 : null,
    totalPage: totalPages,
    totalVideos: totalVideos,
  };

  // Return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: result.data,
        pagination,
      },
      'Videos Retrieval Successfully'
    )
  );
});

module.exports = getAllVideos;
