const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');
const CustomError = require('../../utils/Error');

const getPlaylistById = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  // check valid playlistId
  if (!isValidObjectId(playlistId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Playlist ID'],
      hints: 'Please check the playlist ID and try again',
    });

    return next(error);
  }

  // find the playlist
  const playlist = await Playlist.findById(playlistId);

  // check for playlist exist
  if (!playlist) {
    const error = CustomError.notFound({
      message: 'Playlist not found!',
      errors: ['The specified playlist could not be found.'],
      hints: 'Please check the playlist ID and try again',
    });

    return next(error);
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, 'Playlist info Fetched Successfully'));
});

module.exports = getPlaylistById;
