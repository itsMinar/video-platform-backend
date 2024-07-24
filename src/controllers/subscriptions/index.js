const getSubscribedChannels = require('./getSubscribedChannels.controller');
const getUserChannelSubscribers = require('./getUserChannelSubscribers.controller');
const toggleSubscription = require('./toggleSubscription.controller');

module.exports = {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
};
