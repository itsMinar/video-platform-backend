const router = require('express').Router();
const { healthCheck } = require('../controllers/healthCheck.controller.js');

router.route('/').get(healthCheck);

module.exports = router;
