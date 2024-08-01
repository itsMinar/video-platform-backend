const { upload } = require('../middlewares/multer.middleware.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require('../controllers/videos');

const router = require('express').Router();

// public routes
router.route('/').get(getAllVideos);

// secured routes
router.route('/').post(
  verifyJWT,
  upload.fields([
    {
      name: 'videoFile',
      maxCount: 1,
    },
    {
      name: 'videoThumbnail',
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router
  .route('/:videoId')
  .get(getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, upload.single('thumbnail'), updateVideo);

module.exports = router;
