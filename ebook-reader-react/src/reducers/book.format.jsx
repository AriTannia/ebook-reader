import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as BookFormatService from "../services/book.format.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";

export const fetchAllBookFormats = createAsyncThunk(
  "bookFormats/fetchAllBookFormats",
  async (bookId, thunkAPI) => {
    try {
      const response = await BookFormatService.getAllBookFormats(bookId);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'No formats found for this book.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addBookFormat = createAsyncThunk(
  "bookFormats/addBookFormat",
  async ({ bookId, formatData }, thunkAPI) => {
    try {
      const response = await BookFormatService.addNewBookFormat(bookId, formatData);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const setPrimaryBookFormat = createAsyncThunk(
  "bookFormats/setPrimaryBookFormat",
  async ({ bookId, formatId, isPrimary }, thunkAPI) => {
    try {
      const response = await BookFormatService.updatePrimaryFormat(bookId, formatId, isPrimary);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'Book format not found.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteBookFormat = createAsyncThunk(
  "bookFormats/deleteBookFormat",
  async ({ bookId, formatId }, thunkAPI) => {
    try {
      await BookFormatService.deleteBookFormat(bookId, formatId);
      return formatId;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'Book format not found. It may have already been deleted.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  formats: [],
  loading: false,
  error: null,
};

const bookFormatSlice = createSlice({
  name: "bookFormats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookFormats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookFormats.fulfilled, (state, action) => {
        state.loading = false;
        state.formats = action.payload.data;
      })
      .addCase(fetchAllBookFormats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch book formats.";
      })
      .addCase(addBookFormat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookFormat.fulfilled, (state, action) => {
        state.loading = false;
        state.formats.push(action.payload);
      })
      .addCase(addBookFormat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add book format.";
      })
      .addCase(setPrimaryBookFormat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPrimaryBookFormat.fulfilled, (state, action) => {
        state.loading = false;
        const updatedFormat = action.payload;
        state.formats = state.formats.map((format) =>
          format.id === updatedFormat.id ? updatedFormat : format
        );
      })
      .addCase(setPrimaryBookFormat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update primary book format.";
      })
      .addCase(deleteBookFormat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookFormat.fulfilled, (state, action) => {
        state.loading = false;
        state.formats = state.formats.filter(
          (format) => format.id !== action.payload
        );
      })
      .addCase(deleteBookFormat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete book format.";
      });
  },
});

export default bookFormatSlice.reducer;