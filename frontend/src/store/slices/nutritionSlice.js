import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/nutrition/';

// Get user nutrition logs
export const getNutritionLogs = createAsyncThunk('nutrition/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Create new nutrition log
export const createNutritionLog = createAsyncThunk('nutrition/create', async (logData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, logData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState: {
    logs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    resetNutritionState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNutritionLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNutritionLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs = action.payload;
      })
      .addCase(getNutritionLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createNutritionLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNutritionLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs.unshift(action.payload);
      })
      .addCase(createNutritionLog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetNutritionState } = nutritionSlice.actions;
export default nutritionSlice.reducer;
