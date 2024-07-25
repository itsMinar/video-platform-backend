const addVideoToPlaylist = require('./addVideoToPlaylist.controller');
const createPlaylist = require('./createPlaylist.controller');
const deletePlaylist = require('./deletePlaylist.controller');
const getPlaylistById = require('./getPlaylistById.controller');
const getUserPlaylists = require('./getUserPlaylists.controller');
const removeVideoFromPlaylist = require('./removeVideoFromPlaylist.controller');
const updatePlaylist = require('./updatePlaylist.controller');

module.exports = {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
};
