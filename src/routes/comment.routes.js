const router = require('express').Router();
const { verifyJWT } = require('../middlewares/auth.middleware.js');
const {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');

// public routes
router.route('/:videoId').get(getVideoComments);

// secure routes
router.route('/:videoId').post(verifyJWT, addComment);
router
  .route('/c/:commentId')
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);

module.exports = router;
