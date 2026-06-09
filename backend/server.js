const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: require('path').join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

const path = require('path');
const fs = require('fs');
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors());

// Default Route
app.get('/', (req, res) => {
    res.send('Fitness Tracker API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/plan', require('./routes/planRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
