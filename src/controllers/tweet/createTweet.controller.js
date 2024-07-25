const { Tweet } = require('../../models/tweet.model');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // validation - not empty
  if (!content) {
    throw new ApiError(400, 'All fields are required');
  }

  // create tweet object - create entry in DB
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  // check that tweet saved in the DB
  const createdTweet = await Tweet.findById(tweet._id);

  // check for user creation
  if (!createdTweet) {
    throw new ApiError(500, 'Something went wrong while creating the tweet');
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, 'Tweet created Successfully'));
});

module.exports = createTweet;
