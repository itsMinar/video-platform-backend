const { z } = require('zod');
const { Tweet } = require('../../models/tweet.model');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const createTweet = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    content: z
      .string({ message: 'Tweet content is required' })
      .min(1, 'Tweet content must be at least 1 character'),
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

  // create tweet object - create entry in DB
  const tweet = await Tweet.create({
    content: validation.data.content,
    owner: req.user._id,
  });

  // check that tweet saved in the DB
  const createdTweet = await Tweet.findById(tweet._id);

  // check for user creation
  if (!createdTweet) {
    const error = CustomError.serverError({
      message: 'Something went wrong while creating the tweet',
      errors: ['An error occurred during the tweet creation process.'],
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, 'Tweet created Successfully'));
});

module.exports = createTweet;
