import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import nutritionReducer from './slices/nutritionSlice';
import progressReducer from './slices/progressSlice';
import planReducer from './slices/planSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    nutrition: nutritionReducer,
    progress: progressReducer,
    plan: planReducer,
  },
});
