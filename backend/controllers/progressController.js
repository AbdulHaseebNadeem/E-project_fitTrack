const Progress = require('../models/Progress');

const getProgressLogs = async (req, res) => {
    try {
        const logs = await Progress.find({ user: req.user._id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProgressLog = async (req, res) => {
    const { weight, date } = req.body;

    try {
        const log = new Progress({
            user: req.user._id,
            weight,
            date: date || Date.now()
        });

        const createdLog = await log.save();
        res.status(201).json(createdLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProgressLogs, addProgressLog };
