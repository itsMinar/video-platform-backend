const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // check valid playlistId
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(404, 'Invalid Playlist ID');
  }

  // find the playlist
  const playlist = await Playlist.findById(playlistId);

  // check for playlist exist
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found.');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, playlist, 'Playlist info Fetched Successfully'));
});

module.exports = getPlaylistById;
