import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNutritionLog } from '../store/slices/nutritionSlice';

const NutritionForm = () => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createNutritionLog({ foodName, calories: Number(calories), mealType }));
    setFoodName('');
    setCalories('');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
      <input type="text" placeholder="Food Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
      <input type="number" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} required />
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </select>
      <button type="submit" className="btn-primary" style={{ marginTop: '10px', background: 'linear-gradient(135deg, var(--accent-color), #7c3aed)' }}>Save Meal</button>
    </form>
  );
};

export default NutritionForm;
