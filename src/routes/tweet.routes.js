const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} = require('../controllers/tweet');

const router = require('express').Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route('/').post(createTweet);
router.route('/user/:userId').get(getUserTweets);
router.route('/:tweetId').patch(updateTweet).delete(deleteTweet);

module.exports = router;
