const router = require('express').Router();
const { healthcheck } = require('../controllers/healthcheck.controller.js');

router.route('/').get(healthcheck);

module.exports = router;
