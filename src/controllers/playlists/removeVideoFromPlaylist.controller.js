const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');
const CustomError = require('../../utils/Error');

const removeVideoFromPlaylist = asyncHandler(async (req, res, next) => {
  const { videoId, playlistId } = req.params;

  // Check valid videoId and playlistId
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Video or Playlist ID'],
      hints: 'Please check the Video ID or Playlist ID and try again.',
    });

    return next(error);
  }

  // find the playlist and remove video from the list
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    const error = CustomError.notFound({
      message: 'Playlist not found!',
      errors: ['The specified playlist could not be found.'],
      hints: 'Please check the playlist ID and try again.',
    });

    return next(error);
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
