const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { playlistId } = req.params;

  // check valid playlistId
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(404, 'Invalid Playlist ID');
  }

  // validation - not empty
  if ([name, description].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const playlist = await Playlist.findById(playlistId);

  // check for playlist exist
  if (!playlist) {
    throw new ApiError(404, 'Playlist not found.');
  }

  // update playlist info
  playlist.name = name;
  playlist.description = description;

  // save new info to the DB
  await playlist.save();

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, playlist, 'Playlist Updated Successfully'));
});

module.exports = updatePlaylist;
