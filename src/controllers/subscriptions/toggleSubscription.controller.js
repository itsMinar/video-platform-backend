const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { isValidObjectId } = require('mongoose');
const { Subscription } = require('../../models/subscription.model');
const { User } = require('../../models/user.model');
const CustomError = require('../../utils/Error');

const toggleSubscription = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;

  // check valid channelId
  if (!isValidObjectId(channelId)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['Invalid Channel ID'],
      hints: 'Please check the Channel ID and try again.',
    });

    return next(error);
  }

  // find the Channel in DB
  const channelExist = await User.findById(channelId).select('username');

  if (!channelExist) {
    const error = CustomError.notFound({
      message: 'Channel is not Existed!',
      errors: ['The specified channel could not be found.'],
      hints: 'Please check the channel ID and try again.',
    });

    return next(error);
  }

  // can't subscribe his own channel
  if (channelId === req.user._id.toString()) {
    const error = CustomError.badRequest({
      message: 'You cannot Subscribe to your own Channel!',
      errors: ['The user cannot subscribe to their own channel.'],
      hints: 'Please select a different channel to subscribe to.',
    });

    return next(error);
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
    const error = CustomError.serverError({
      message: 'Something went wrong while toggling the subscription',
      errors: ['An error occurred during the subscription toggle process.'],
      hints: 'Please try again later. If the issue persists, contact support.',
    });

    return next(error);
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdSubscription, 'Subscribed Successfully'));
});

module.exports = toggleSubscription;
