const PlanProgress = require('../models/PlanProgress');

// Helper to generate task for a specific day
const getTaskForDay = (day) => {
    const workouts = [
        "Rest & Recovery (15 mins Stretching)",
        "Full Body Strength (Bodyweight or Dumbbells - 45 mins)",
        "Cardio & Core (30 mins brisk walk + 5 min Planks)",
        "Upper Body Power (Pushups, Pull-ups, Rows - 40 mins)",
        "Lower Body Burn (Squats, Lunges, Glute bridges - 40 mins)",
        "HIIT (High Intensity Interval Training - 20 mins)",
        "Active Recovery (Light jogging or Cycling - 30 mins)"
    ];
    
    const diets = [
        "Hydration Focus: Drink 3L Water minimum, eat light.",
        "Low Carb Day: Chicken/Tofu with lots of Greens.",
        "Balanced Day: Complex Carbs (Oats/Brown Rice) + Protein.",
        "Intermittent Fasting (14-16 hours) + Lean Protein.",
        "Detox Day: Smoothies, Salads, and Soups.",
        "High Protein Day: Eggs, Lean Meat, Legumes.",
        "Healthy Fats Day: Avocado, Nuts, Olive Oil."
    ];

    const calorieTargets = [
        1600, // Rest day
        1800, // Full body strength
        1700, // Cardio & Core
        1800, // Upper Body Power
        1800, // Lower Body Burn
        1700, // HIIT
        1600  // Active Recovery
    ];

    const workout = workouts[day % 7];
    const diet = diets[day % 7];
    const calorieTarget = calorieTargets[day % 7];

    return { day, workout, diet, calorieTarget };
};

const getPlan = async (req, res) => {
    try {
        let plan = await PlanProgress.findOne({ user: req.user._id });
        
        if (!plan) {
            return res.json({ message: "No active plan" });
        }

        // Calculate current day
        const now = new Date();
        const start = new Date(plan.startDate);
        start.setHours(0, 0, 0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - start);
        let currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (currentDay > 60) {
            plan.isActive = false;
            await plan.save();
            return res.json({ ...plan.toObject(), currentDay: 60, status: "Completed 60 Days!" });
        }

        const todaysTask = getTaskForDay(currentDay);

        res.json({
            plan,
            currentDay,
            todaysTask
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const startPlan = async (req, res) => {
    try {
        let plan = await PlanProgress.findOne({ user: req.user._id });
        if (plan) {
            return res.status(400).json({ message: "Plan already started" });
        }

        plan = new PlanProgress({
            user: req.user._id,
            startDate: new Date(),
            dailyLogs: []
        });

        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeTodaysTask = async (req, res) => {
    try {
        let plan = await PlanProgress.findOne({ user: req.user._id });
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        const now = new Date();
        const start = new Date(plan.startDate);
        start.setHours(0, 0, 0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - start);
        let currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Check if already logged today
        const existingLogIndex = plan.dailyLogs.findIndex(log => log.day === currentDay);
        
        if (existingLogIndex >= 0) {
            // Toggle status
            plan.dailyLogs[existingLogIndex].isCompleted = !plan.dailyLogs[existingLogIndex].isCompleted;
        } else {
            plan.dailyLogs.push({
                day: currentDay,
                date: now,
                isCompleted: true
            });
        }

        await plan.save();
        
        const todaysTask = getTaskForDay(currentDay);
        res.json({ plan, currentDay, todaysTask });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlan, startPlan, completeTodaysTask };
