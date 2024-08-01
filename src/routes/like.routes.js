const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} = require('../controllers/likes');

const router = require('express').Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route('/videos').get(getLikedVideos);
router.route('/toggle/v/:videoId').post(toggleVideoLike);
router.route('/toggle/c/:commentId').post(toggleCommentLike);
router.route('/toggle/t/:tweetId').post(toggleTweetLike);

module.exports = router;
