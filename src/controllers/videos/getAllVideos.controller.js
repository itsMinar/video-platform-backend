const { Video } = require('../../models/video.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const videos = await Video.find();

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          totalPage: 'Added soon...',
        },
      },
      'Videos fetched Successfully'
    )
  );
});

module.exports = getAllVideos;
