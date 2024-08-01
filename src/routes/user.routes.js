const { upload } = require('../middlewares/multer.middleware.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
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
} = require('../controllers/users');

const router = require('express').Router();

// public routes
router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route('/login').post(loginUser);

// secured routes
router.route('/refresh-token').post(refreshAccessToken);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router
  .route('/avatar')
  .patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router
  .route('/cover-image')
  .patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);

router.route('/c/:username').get(verifyJWT, getUserChannelProfile);
router.route('/history').get(verifyJWT, getWatchHistory);

module.exports = router;
