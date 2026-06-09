const mongoose = require('mongoose');

const planProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, required: true, default: Date.now },
    // Array to track completion status for each day (1 to 60)
    dailyLogs: [{
        day: { type: Number, required: true },
        date: { type: Date, required: true },
        isCompleted: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('PlanProgress', planProgressSchema);
