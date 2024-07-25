const getLikedVideos = require('./getLikedVideos.controller');
const toggleCommentLike = require('./toggleCommentLike.controller');
const toggleTweetLike = require('./toggleTweetLike.controller');
const toggleVideoLike = require('./toggleVideoLike.controller');

module.exports = {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
};
