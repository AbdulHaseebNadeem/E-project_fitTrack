// Dashboard Component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getWorkouts } from '../store/slices/workoutSlice';
import { getNutritionLogs } from '../store/slices/nutritionSlice';
import { getProgressLogs } from '../store/slices/progressSlice';
import WorkoutForm from '../components/WorkoutForm';
import NutritionForm from '../components/NutritionForm';
import ProgressForm from '../components/ProgressForm';
import CaloriesChart from '../components/CaloriesChart';
import SixtyDaysPlan from '../components/SixtyDaysPlan';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { workouts, isLoading: isWorkoutLoading } = useSelector((state) => state.workout);
  const { logs, isLoading: isNutritionLoading } = useSelector((state) => state.nutrition);
  const { logs: progressLogs, isLoading: isProgressLoading } = useSelector((state) => state.progress);
  
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(getWorkouts());
      dispatch(getNutritionLogs());
      dispatch(getProgressLogs());
    }
  }, [isAuthenticated, navigate, dispatch]);

  const totalCalories = logs.reduce((acc, log) => acc + log.calories, 0);
  const today = new Date().toDateString();
  const todaysCalories = logs
    .filter(log => new Date(log.date).toDateString() === today)
    .reduce((acc, log) => acc + log.calories, 0);

  const { todaysTask } = useSelector((state) => state.plan);
  const calorieTarget = todaysTask?.calorieTarget || 2000; // Default to 2000 if no active plan

  const currentWeight = progressLogs.length > 0 ? progressLogs[0].weight : null;

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome to your Dashboard, {user?.name}!</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <SixtyDaysPlan />

        {/* Workout Summary Card */}
        <div className="card">
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>🏋️ Recent Workouts</h2>
          {isWorkoutLoading ? <p className="text-muted">Loading...</p> : (
            workouts.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                {workouts.slice(0, 3).map(workout => (
                  <li key={workout._id} style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0' }}>
                    <strong>{workout.exerciseName}</strong> - {workout.sets} sets x {workout.reps} reps
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted">You haven't logged any workouts recently.</p>
          )}
          
          <button onClick={() => setShowWorkoutForm(!showWorkoutForm)} className="btn-primary" style={{ marginTop: '1rem', padding: '8px 16px', fontSize: '0.9rem' }}>
            {showWorkoutForm ? 'Cancel' : '+ Log Workout'}
          </button>
          {showWorkoutForm && <WorkoutForm />}
        </div>

        {/* Nutrition Summary Card */}
        <div className="card">
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>🍔 Today's Nutrition</h2>
          {isNutritionLoading ? <p className="text-muted">Loading...</p> : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{todaysCalories}</p>
                <p className="text-muted" style={{ fontSize: '1rem' }}>/ {calorieTarget} kcal</p>
              </div>
              
              {/* Daily Calorie Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden', margin: '10px 0' }}>
                <div style={{ 
                  width: `${Math.min((todaysCalories / calorieTarget) * 100, 100)}%`, 
                  height: '100%', 
                  background: todaysCalories > calorieTarget ? '#ef4444' : 'var(--accent-color)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', color: todaysCalories > calorieTarget ? '#ef4444' : 'var(--text-muted)' }}>
                {todaysCalories > calorieTarget ? '⚠️ You have exceeded your daily target!' : `${calorieTarget - todaysCalories} kcal remaining for today`}
              </p>

              <CaloriesChart />
            </>
          )}

          <button onClick={() => setShowNutritionForm(!showNutritionForm)} className="btn-primary" style={{ marginTop: '1rem', padding: '8px 16px', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--accent-color), #7c3aed)' }}>
            {showNutritionForm ? 'Cancel' : '+ Log Meal'}
          </button>
          {showNutritionForm && <NutritionForm />}
        </div>

        {/* Progress Summary Card */}
        <div className="card">
          <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>📈 Weight Progress</h2>
          {isProgressLoading ? <p className="text-muted">Loading...</p> : (
             <p className="text-muted">Current Weight: {currentWeight ? <span style={{fontWeight: 'bold', color: 'var(--text-main)'}}>{currentWeight} kg</span> : 'Not logged'}</p>
          )}

          <button onClick={() => setShowProgressForm(!showProgressForm)} className="btn-primary" style={{ marginTop: '1rem', padding: '8px 16px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            {showProgressForm ? 'Cancel' : '+ Update Weight'}
          </button>
          {showProgressForm && <ProgressForm />}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
