const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check valid userId
  if (!isValidObjectId(userId)) {
    throw new ApiError(404, 'Invalid User ID');
  }

  // find the playlist
  const playlist = await Playlist.find({ owner: userId }).populate('videos');

  if (playlist.length <= 0) {
    throw new ApiError(404, 'This user has no Playlist');
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        playlist,
        'All Playlist of User fetched Successfully'
      )
    );
});

module.exports = getUserPlaylists;
