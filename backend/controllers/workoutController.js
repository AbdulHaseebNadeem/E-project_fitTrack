const Workout = require('../models/Workout');

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createWorkout = async (req, res) => {
    const { exerciseName, sets, reps, weight, category, date } = req.body;

    try {
        const workout = new Workout({
            user: req.user._id,
            exerciseName,
            sets,
            reps,
            weight,
            category,
            date
        });

        const createdWorkout = await workout.save();
        res.status(201).json(createdWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await workout.deleteOne();
        res.json({ message: 'Workout removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWorkouts, createWorkout, deleteWorkout };
