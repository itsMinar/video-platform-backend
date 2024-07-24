const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { isValidObjectId } = require('mongoose');
const { Subscription } = require('../../models/subscription.model');
const { User } = require('../../models/user.model');

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // check valid channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, 'Invalid Channel ID');
  }

  // find the Channel in DB
  const channelExist = await User.findById(channelId).select('username');

  if (!channelExist) {
    throw new ApiError(404, 'Channel is not Existed!');
  }

  // can't subscribe his own channel
  if (channelId === req.user._id.toString()) {
    throw new ApiError(404, 'You can not Subscribe your own Channel!');
  }

  // search the channel that already subscribed or not
  const alreadySubscribed = await Subscription.findOne({
    $and: [{ subscriber: req.user._id }, { channel: channelId }],
  });

  if (alreadySubscribed) {
    await alreadySubscribed.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Unsubscribed Successfully'));
  }

  // create subscription object - create entry in DB
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  // check that subscription saved in the DB
  const createdSubscription = await Subscription.findById(subscription._id);

  if (!createdSubscription) {
    throw new ApiError(
      500,
      'Something went wrong while toggling the subscription'
    );
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdSubscription, 'Subscribed Successfully'));
});

module.exports = toggleSubscription;
