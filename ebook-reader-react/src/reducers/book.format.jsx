import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as BookFormatService from "../services/book.format.service";
import { setMessage } from "./message";
import { act } from "react";

export const fetchAllBookFormats = createAsyncThunk(
  "bookFormats/fetchAllBookFormats",
  async (bookId, thunkAPI) => {
    try {
      const response = await BookFormatService.getAllBookFormats(bookId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching book formats.";
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
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding a new book format.";
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
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the book format.";
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