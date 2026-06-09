const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, required: true, enum: ['Weight Loss', 'Muscle Gain', 'Consistency'] },
    targetValue: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, default: 'In Progress', enum: ['In Progress', 'Completed', 'Failed'] }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
