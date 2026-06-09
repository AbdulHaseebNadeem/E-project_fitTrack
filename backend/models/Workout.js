const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exerciseName: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Strength', 'Cardio', 'Flexibility'] },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
