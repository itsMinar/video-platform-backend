const router = require('express').Router();
const { healthCheck } = require('../controllers/healthcheck.controller.js');

router.route('/').get(healthCheck);

module.exports = router;
