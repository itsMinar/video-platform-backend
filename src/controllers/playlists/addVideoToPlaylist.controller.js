const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');
const CustomError = require('../../utils/Error');

const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
  const { videoId, playlistId } = req.params;

  // Check valid videoId and playlistId
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    const error = CustomError.notFound({
      message: 'Invalid Video or Playlist ID',
      errors: ['The specified Video ID or Playlist ID does not valid.'],
      hints: 'Please check the Video ID or Playlist ID and try again.',
    });

    return next(error);
  }

  // find the playlist
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    const error = CustomError.notFound({
      message: 'Playlist not found!',
      errors: ['The specified playlist could not be found.'],
      hints: 'Please check the playlist ID and try again.',
    });

    return next(error);
  }

  // check that the video already added in the playlist
  playlist.videos.length > 0 &&
    playlist.videos.filter((video) => {
      if (video.toString() === videoId.toString()) {
        const error = CustomError.notFound({
          message: 'This Video is already added in this playlist',
          errors: [
            'The video you are trying to add is already present in the specified playlist.',
          ],
          hints:
            'Please check the playlist contents or try adding a different video.',
        });

        return next(error);
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
