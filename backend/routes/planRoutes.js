const express = require('express');
const router = express.Router();
const { getPlan, startPlan, completeTodaysTask } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPlan).post(protect, startPlan);
router.route('/complete').put(protect, completeTodaysTask);

module.exports = router;
