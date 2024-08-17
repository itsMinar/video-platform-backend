const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { Tweet } = require('../../models/tweet.model');
const CustomError = require('../../utils/Error');

const updateTweet = asyncHandler(async (req, res, next) => {
  const { tweetId } = req.params;

  const schema = z.object({
    tweetId: z
      .string({ message: 'Tweet ID is required' })
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Tweet ID',
      }),
    content: z
      .string({ message: 'Tweet content is required' })
      .min(1, 'Tweet content must be at least 1 character')
      .optional(),
  });

  const validation = schema.safeParse({ ...req.body, tweetId });

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // find tweet by the Tweet ID from DB
  const updatedTweet = await Tweet.findByIdAndUpdate(
    validation.data.tweetId,
    validation.data,
    { new: true }
  );

  if (!updatedTweet) {
    const error = CustomError.notFound({
      message: 'Tweet not found',
      errors: ['The specified tweet could not be found.'],
      hints: 'Please check the tweet ID and try again',
    });

    return next(error);
  }

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, 'Tweet Updated Successfully'));
});

module.exports = updateTweet;
