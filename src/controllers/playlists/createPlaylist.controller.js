const { Playlist } = require('../../models/playlist.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // validation - not empty
  if ([name, description].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  // create playlist object - create entry in DB
  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  const createdPlaylist = await Playlist.findById(playlist._id);

  // check for playlist creation
  if (!createdPlaylist) {
    throw new ApiError(500, 'Something went wrong while creating the playlist');
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdPlaylist, 'Playlist Created Successfully')
    );
});

module.exports = createPlaylist;
