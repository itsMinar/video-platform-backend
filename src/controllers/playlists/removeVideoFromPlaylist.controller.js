const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  // Check valid videoId and playlistId
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    throw new ApiError(404, 'Invalid Video or Playlist ID');
  }

  // find the playlist and remove video from the list
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, 'Playlist not found!');
  }

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        'Video Removed from the Playlist Successfully'
      )
    );
});

module.exports = removeVideoFromPlaylist;
