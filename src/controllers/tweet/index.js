const createTweet = require('./createTweet.controller');
const deleteTweet = require('./deleteTweet.controller');
const getUserTweets = require('./getUserTweets.controller');
const updateTweet = require('./updateTweet.controller');

module.exports = { createTweet, getUserTweets, updateTweet, deleteTweet };
