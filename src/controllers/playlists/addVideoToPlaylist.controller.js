const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  // Check valid videoId and playlistId
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    throw new ApiError(404, 'Invalid Video or Playlist ID');
  }

  // find the playlist
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, 'Playlist not found!');
  }

  // check that the video already added in the playlist
  playlist.videos.length > 0 &&
    playlist.videos.filter((video) => {
      if (video.toString() === videoId.toString()) {
        throw new ApiError(404, 'This Video is already added in this playlist');
      }
    });

  // add video to the playlist object
  playlist.videos.push(videoId);

  // save everything to the DB
  await playlist.save();

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(201, playlist, 'Video Added to the Playlist Successfully')
    );
});

module.exports = addVideoToPlaylist;
