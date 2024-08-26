const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');
const CustomError = require('../../utils/Error');

const getUserPlaylists = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Check valid userId
  if (!isValidObjectId(userId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid User ID'],
      hints: 'Please check the User ID and try again',
    });

    return next(error);
  }

  // find the playlist
  const playlist = await Playlist.find({ owner: userId }).populate('videos');

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        'All Playlist of User fetched Successfully'
      )
    );
});

module.exports = getUserPlaylists;
