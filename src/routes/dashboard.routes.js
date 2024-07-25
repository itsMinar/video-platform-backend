const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  getChannelStats,
  getChannelVideos,
} = require('../controllers/dashboard');

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route('/stats').get(getChannelStats);
router.route('/videos').get(getChannelVideos);

module.exports = router;
