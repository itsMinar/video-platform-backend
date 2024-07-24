const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} = require('../controllers/subscriptions');

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route('/c/:channelId')
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route('/u/:subscriberId').get(getUserChannelSubscribers);

module.exports = router;
