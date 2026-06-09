const express = require('express');
const router = express.Router();
const { getNutritionLogs, createNutritionLog, deleteNutritionLog } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNutritionLogs).post(protect, createNutritionLog);
router.route('/:id').delete(protect, deleteNutritionLog);

module.exports = router;
