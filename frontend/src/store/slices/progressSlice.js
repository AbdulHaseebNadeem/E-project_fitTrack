import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/progress/';

// Get user progress logs
export const getProgressLogs = createAsyncThunk('progress/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Create new progress log
export const addProgressLog = createAsyncThunk('progress/add', async (logData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, logData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    logs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    resetProgressState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProgressLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgressLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs = action.payload;
      })
      .addCase(getProgressLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addProgressLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProgressLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs.unshift(action.payload);
      })
      .addCase(addProgressLog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetProgressState } = progressSlice.actions;
export default progressSlice.reducer;
