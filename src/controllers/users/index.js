const changeCurrentPassword = require('./changeCurrentPassword.controller');
const clearWatchHistory = require('./clearWatchHistory.controller');
const getCurrentUser = require('./getCurrentUser.controller');
const getUserChannelProfile = require('./getUserChannelProfile.controller');
const getWatchHistory = require('./getWatchHistory.controller');
const loginUser = require('./loginUser.controller');
const logoutUser = require('./logutUser.controller');
const refreshAccessToken = require('./refreshAccessToken.controller');
const registerUser = require('./registerUser.controller');
const updateAccountDetails = require('./updateAccountDetails.controller');
const updateUserAvatar = require('./updateUserAvatar.controller');
const updateUserCoverImage = require('./updateUserCoverImage.controller');

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  clearWatchHistory,
};
