const { healthCheck } = require('../controllers/health-check');

const router = require('express').Router();

router.route('/').get(healthCheck);

module.exports = router;
