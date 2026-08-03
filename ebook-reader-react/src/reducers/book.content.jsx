import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as BookContentService from "../services/book.content.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";

export const streamPdf = createAsyncThunk(
  "bookContent/streamPdf",
  async (bookId) => {
    return BookContentService.buildStreamUrl(bookId);
  },
);

export const fetchContentUrl = createAsyncThunk(
  "bookContent/fetchContentUrl",
  async (bookId, thunkAPI) => {
    try {
      const response = await BookContentService.getContentUrl(bookId);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 403: 'You do not have access to this content.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchBookFormatForReading = createAsyncThunk(
  "bookContent/fetchBookFormatForReading",
  async (bookId, thunkAPI) => {
    try {
      const response = await BookContentService.getBookFormatForReading(bookId);
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error, { 403: 'You do not have access to this book.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  contentUrl: null,
  pdfStream: null,
  bookFormat: null,
  loading: false,
  error: null,
};

const bookContentSlice = createSlice({
  name: "bookContent",
  initialState,
  reducers: {
    resetBookContent: (state) => {
      state.contentUrl = null;
      state.pdfStream = null;
      state.bookFormat = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(streamPdf.fulfilled, (state, action) => {
        state.pdfStream = action.payload;
      })
      .addCase(fetchContentUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.contentUrl = action.payload;
      })
      .addCase(fetchContentUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookFormatForReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookFormatForReading.fulfilled, (state, action) => {
        state.loading = false;
        state.bookFormat = action.payload;
      })
      .addCase(fetchBookFormatForReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetBookContent } = bookContentSlice.actions;
export default bookContentSlice.reducer;
