import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProgressLog } from '../store/slices/progressSlice';

const ProgressForm = () => {
  const [weight, setWeight] = useState('');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addProgressLog({ weight: Number(weight) }));
    setWeight('');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
      <input type="number" step="0.1" placeholder="Weight (kg/lbs)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <button type="submit" className="btn-primary" style={{ marginTop: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>Save Weight</button>
    </form>
  );
};

export default ProgressForm;
