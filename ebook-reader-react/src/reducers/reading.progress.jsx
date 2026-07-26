import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ReadingProgressService from "../services/reading.progress.service";
import { setMessage } from "./message";

export const saveReadingProgress = createAsyncThunk(
  "readingProgress/saveReadingProgress",
  async (progressData, { rejectWithValue, dispatch }) => {
    try {
      const response = await ReadingProgressService.saveProgress(progressData);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  },
);

export const refreshReadingUrl = createAsyncThunk(
  "readingProgress/refreshReadingUrl",
  async (bookId, { rejectWithValue, dispatch }) => {
    try {
      const response = await ReadingProgressService.refreshReadingUrl(bookId);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  },
);

export const getRecentReading = createAsyncThunk(
  "readingProgress/getRecentReading",
  async (limit = 10, { rejectWithValue, dispatch }) => {
    try {
      const response = await ReadingProgressService.getRecentReading(limit);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  },
);

export const markAsFinished = createAsyncThunk(
  "readingProgress/markAsFinished",
  async (bookId, { rejectWithValue, dispatch }) => {
    try {
      const response = await ReadingProgressService.markAsFinished(bookId);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  },
);

const initialState = {
    recentReading: [],
    currentReading: null,
    loading: false,
    error: null,
}

const readingProgressSlice = createSlice({
  name: "readingProgress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(saveReadingProgress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(saveReadingProgress.fulfilled, (state, action) => {
            state.loading = false;
            state.currentReading = action.payload;
        })
        .addCase(saveReadingProgress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(refreshReadingUrl.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(refreshReadingUrl.fulfilled, (state, action) => {
            state.loading = false;
            state.currentReading = action.payload;
        })
        .addCase(refreshReadingUrl.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getRecentReading.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getRecentReading.fulfilled, (state, action) => {
            state.loading = false;
            state.recentReading = action.payload;
        })
        .addCase(getRecentReading.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(markAsFinished.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(markAsFinished.fulfilled, (state, action) => {
            state.loading = false;
            state.currentReading = action.payload;
        })
        .addCase(markAsFinished.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }); 
  },
});

export default readingProgressSlice.reducer;