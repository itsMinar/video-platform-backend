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
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

module.exports = router;
