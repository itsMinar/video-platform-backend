const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} = require('../controllers/subscriptions');

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router
  .route('/c/:channelId')
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route('/u/:subscriberId').get(getUserChannelSubscribers);

module.exports = router;
