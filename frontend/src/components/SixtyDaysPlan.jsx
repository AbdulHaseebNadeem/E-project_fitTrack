import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPlan, startPlan, completeTask } from '../store/slices/planSlice';

const SixtyDaysPlan = () => {
  const dispatch = useDispatch();
  const { planData, currentDay, todaysTask, isLoading } = useSelector((state) => state.plan);

  const [workoutChecked, setWorkoutChecked] = useState(false);
  const [dietChecked, setDietChecked] = useState(false);

  useEffect(() => {
    dispatch(getPlan());
  }, [dispatch]);

  // Check if today's task is completed
  const isTodayCompleted = planData?.dailyLogs?.find(log => log.day === currentDay)?.isCompleted || false;

  useEffect(() => {
    if (isTodayCompleted) {
      setWorkoutChecked(true);
      setDietChecked(true);
    } else {
      setWorkoutChecked(false);
      setDietChecked(false);
    }
  }, [isTodayCompleted, currentDay]);

  if (isLoading) return <p className="text-muted">Loading your plan...</p>;

  if (!planData) {
    return (
      <div className="card" style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>🔥 60 Days Ultimate Weight Loss Challenge</h2>
        <p className="text-muted" style={{ margin: '1rem 0' }}>
          Follow this professional 60 days plan to lose up to <strong>5-8 kg</strong> safely! 
          You will receive a daily workout and diet plan specifically designed for consistent fat loss.
        </p>
        <button className="btn-primary" onClick={() => dispatch(startPlan())}>Start My 60 Days Plan</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ gridColumn: '1 / -1', border: isTodayCompleted ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--text-main)' }}>🔥 60 Days Challenge <span style={{color: 'var(--primary-color)', fontSize: '1.2rem'}}>- Day {currentDay}</span></h2>
        {isTodayCompleted ? (
          <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', padding: '4px 12px', border: '1px solid var(--primary-color)', borderRadius: '20px' }}>✓ Completed</span>
        ) : (
          <span style={{ color: '#ef4444', fontWeight: 'bold', padding: '4px 12px', border: '1px solid #ef4444', borderRadius: '20px' }}>✗ Incomplete</span>
        )}
      </div>
      
      {todaysTask && (
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
            <input type="checkbox" checked={workoutChecked} onChange={() => setWorkoutChecked(!workoutChecked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} />
            <p><strong style={{color: 'var(--accent-color)'}}>🏋️ Workout:</strong> <span style={{ textDecoration: workoutChecked ? 'line-through' : 'none', color: workoutChecked ? 'var(--text-muted)' : 'inherit' }}>{todaysTask.workout}</span>{workoutChecked && " ✅"}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
            <input type="checkbox" checked={dietChecked} onChange={() => setDietChecked(!dietChecked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} />
            <p><strong style={{color: '#3b82f6'}}>🥗 Diet:</strong> <span style={{ textDecoration: dietChecked ? 'line-through' : 'none', color: dietChecked ? 'var(--text-muted)' : 'inherit' }}>{todaysTask.diet}</span>{dietChecked && " ✅"}</p>
          </div>
          
          <p style={{ marginLeft: '30px', fontSize: '0.9rem' }}><strong style={{color: '#f59e0b'}}>🎯 Calorie Target:</strong> {todaysTask.calorieTarget} kcal / day</p>
        </div>
      )}

      <button 
        className="btn-primary" 
        onClick={() => dispatch(completeTask())}
        disabled={(!workoutChecked || !dietChecked) && !isTodayCompleted}
        style={{ 
          width: '100%', 
          background: isTodayCompleted ? '#334155' : ((workoutChecked && dietChecked) ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : '#475569'), 
          opacity: ((workoutChecked && dietChecked) || isTodayCompleted) ? 1 : 0.5,
          cursor: ((workoutChecked && dietChecked) || isTodayCompleted) ? 'pointer' : 'not-allowed'
        }}
      >
        {isTodayCompleted ? 'Mark as Incomplete' : 'Complete Today\'s Task'}
      </button>

      {/* Progress Bar */}
      <div style={{ marginTop: '1.5rem' }}>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Plan Progress: {Math.round((currentDay/60)*100)}%</p>
        <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${(currentDay/60)*100}%`, height: '100%', background: 'var(--primary-color)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SixtyDaysPlan;
