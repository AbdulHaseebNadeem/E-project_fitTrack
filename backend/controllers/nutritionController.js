const Nutrition = require('../models/Nutrition');

const getNutritionLogs = async (req, res) => {
    try {
        const logs = await Nutrition.find({ user: req.user._id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNutritionLog = async (req, res) => {
    const { mealType, foodName, calories, date } = req.body;

    try {
        const log = new Nutrition({
            user: req.user._id,
            mealType,
            foodName,
            calories,
            date
        });

        const createdLog = await log.save();
        res.status(201).json(createdLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNutritionLog = async (req, res) => {
    try {
        const log = await Nutrition.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ message: 'Nutrition log not found' });
        }

        if (log.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await log.deleteOne();
        res.json({ message: 'Nutrition log removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNutritionLogs, createNutritionLog, deleteNutritionLog };
