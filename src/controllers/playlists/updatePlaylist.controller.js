const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Playlist } = require('../../models/playlist.model');
const CustomError = require('../../utils/Error');

const updatePlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const schema = z.object({
    playlistId: z
      .string({ message: 'Playlist ID is required' })
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Playlist ID',
      }),
    name: z.string({ message: 'Playlist name is required' }).optional(),
    description: z
      .string({ message: 'Playlist description is required' })
      .min(2, 'Description must be at least 2 characters')
      .optional(),
  });

  const validation = schema.safeParse({ playlistId, ...req.body });

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    validation.data.playlistId,
    validation.data,
    { new: true }
  );

  // check for playlist exist
  if (!updatedPlaylist) {
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
    .json(
      new ApiResponse(200, updatedPlaylist, 'Playlist Updated Successfully')
    );
});

module.exports = updatePlaylist;
