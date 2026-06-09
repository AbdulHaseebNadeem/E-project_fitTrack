import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createWorkout } from '../store/slices/workoutSlice';

const WorkoutForm = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('Strength');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createWorkout({ exerciseName, sets: Number(sets), reps: Number(reps), weight: Number(weight), category }));
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
      <input type="text" placeholder="Exercise Name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input type="number" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} required />
        <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} required />
      </div>
      <input type="number" placeholder="Weight (kg/lbs)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Strength">Strength</option>
        <option value="Cardio">Cardio</option>
        <option value="Flexibility">Flexibility</option>
      </select>
      <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Workout</button>
    </form>
  );
};

export default WorkoutForm;
