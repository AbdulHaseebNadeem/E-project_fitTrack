const express = require('express');
const router = express.Router();
const { getProgressLogs, addProgressLog } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProgressLogs).post(protect, addProgressLog);

module.exports = router;
