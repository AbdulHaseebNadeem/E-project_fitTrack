const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);
