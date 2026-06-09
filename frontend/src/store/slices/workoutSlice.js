import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts/';

// Get user workouts
export const getWorkouts = createAsyncThunk('workouts/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Create new workout
export const createWorkout = createAsyncThunk('workouts/create', async (workoutData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, workoutData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    workouts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    resetWorkoutState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkouts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workouts = action.payload;
      })
      .addCase(getWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createWorkout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workouts.unshift(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetWorkoutState } = workoutSlice.actions;
export default workoutSlice.reducer;
