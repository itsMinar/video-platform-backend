const { Router } = require('express');
const { registerUser } = require('../controllers/user.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');

const router = Router();

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

module.exports = router;
