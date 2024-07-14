const deleteVideo = require('./deleteVideo.controller');
const getAllVideos = require('./getAllVideos.controller');
const getVideoById = require('./getVideoById.controller');
const updateVideo = require('./updateVideo.controller');
const uploadVideo = require('./uploadVideo.controller');

module.exports = {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
