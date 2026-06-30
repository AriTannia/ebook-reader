import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as BookService from "../services/book.service";
import { setMessage } from "./message";

export const fetchBooks = createAsyncThunk(
  "book/fetchBooks",
  async (
    { key, filters = {}, badge = null, page = 0, size = 10 },
    thunkAPI,
  ) => {
    try {
      const response = await BookService.getAllBooks(
        { ...filters, page, size },
        badge,
      );

      return {
        key,
        books: response.data.data.content,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching books.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchBookDetails = createAsyncThunk(
  "book/fetchBookDetails",
  async (bookId, thunkAPI) => {
    try {
      const response = await BookService.getBookDetails(bookId);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching book details.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addBook = createAsyncThunk(
  "book/addBook",
  async (bookData, thunkAPI) => {
    try {
      const response = await BookService.addBook(bookData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding the book.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateBookDetails = createAsyncThunk(
  "book/updateBookDetails",
  async ({ bookId, updatedData }, thunkAPI) => {
    try {
      const response = await BookService.updateBookDetails(bookId, updatedData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating book details.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (bookId, thunkAPI) => {
    try {
      await BookService.deleteBook(bookId);
      return bookId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the book.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  books: [],
  sections: {},
  selectedBook: null,
  loadingSections: {},
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        state.loadingSections[action.meta.arg.key] = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loadingSections[action.meta.arg.key] = false;
        const { key, books } = action.payload;
        state.sections[key] = books;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loadingSections[action.meta.arg.key] = false;
        state.error = action.payload;
      })
      .addCase(fetchBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookDetails.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.books.findIndex(
          (book) => book.bookId === action.payload.bookId,
        );

        if (index !== -1) {
          state.books[index] = action.payload;
        }

        if (
          state.selectedBook &&
          state.selectedBook.bookId === action.payload.bookId
        ) {
          state.selectedBook = action.payload;
        }
      })
      .addCase(updateBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;

        state.books = state.books.filter(
          (book) => book.bookId !== action.payload,
        );

        if (
          state.selectedBook &&
          state.selectedBook.bookId === action.payload
        ) {
          state.selectedBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
