const { z } = require('zod');
const { Playlist } = require('../../models/playlist.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const createPlaylist = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    name: z.string({ message: 'Playlist name is required' }),
    description: z
      .string({ message: 'Playlist description is required' })
      .min(2, 'Description must be at least 2 characters'),
  });

  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // create playlist object - create entry in DB
  const playlist = await Playlist.create({
    ...validation.data,
    owner: req.user._id,
  });

  const createdPlaylist = await Playlist.findById(playlist._id);

  // check for playlist creation
  if (!createdPlaylist) {
    const error = CustomError.serverError({
      message: 'Something went wrong while creating the playlist',
      errors: ['An error occurred during the playlist creation process.'],
      hints:
        'Please try again later. If the problem persists, contact support.',
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdPlaylist, 'Playlist Created Successfully')
    );
});

module.exports = createPlaylist;
