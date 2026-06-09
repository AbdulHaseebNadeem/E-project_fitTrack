import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/plan/';

export const getPlan = createAsyncThunk('plan/get', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const startPlan = createAsyncThunk('plan/start', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, {}, config);
    // After starting, fetch the plan again to get currentDay and todaysTask
    thunkAPI.dispatch(getPlan());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const completeTask = createAsyncThunk('plan/complete', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'complete', {}, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    planData: null,
    currentDay: 0,
    todaysTask: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlan.pending, (state) => { state.isLoading = true; })
      .addCase(getPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.planData = action.payload.plan || null;
        state.currentDay = action.payload.currentDay || 0;
        state.todaysTask = action.payload.todaysTask || null;
      })
      .addCase(getPlan.rejected, (state, action) => {
        state.isLoading = false;
        // Optionally handle error
      })
      .addCase(startPlan.pending, (state) => { state.isLoading = true; })
      .addCase(startPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        // startPlan dispatches getPlan which updates state
      })
      .addCase(startPlan.rejected, (state, action) => {
        state.isLoading = false;
        // Optionally handle error
      })
      .addCase(completeTask.pending, (state) => { state.isLoading = true; })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.planData = action.payload.plan;
        state.currentDay = action.payload.currentDay;
        state.todaysTask = action.payload.todaysTask;
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.isLoading = false;
        // Optionally handle error
      });
  },
});

export default planSlice.reducer;
