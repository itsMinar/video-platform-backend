const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
} = require('../controllers/playlists');

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route('/').post(createPlaylist);

router
  .route('/:playlistId')
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist);
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist);

router.route('/user/:userId').get(getUserPlaylists);

module.exports = router;
