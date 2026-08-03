import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthorService from "../services/author.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";

export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async (_, thunkAPI) => {
    try {
      const response = await AuthorService.getAllAuthors();
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchAuthorById = createAsyncThunk(
  "authors/fetchAuthorById",
  async (authorId, thunkAPI) => {
    try {
      const response = await AuthorService.getAuthorById(authorId);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'Author not found.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchAuthorsForAdmin = createAsyncThunk(
  "authors/fetchAuthorsForAdmin",
  async (filters, thunkAPI) => {
    try {
      const response = await AuthorService.getAllAuthorsForAdmin(filters);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addAuthor = createAsyncThunk(
  "authors/addAuthor",
  async (authorData, thunkAPI) => {
    try {
      const response = await AuthorService.addNewAuthor(authorData);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 409: 'An author with this name already exists.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateAuthor = createAsyncThunk(
  "authors/updateAuthor",
  async ({ authorId, updatedData }, thunkAPI) => {
    try {
      const response = await AuthorService.updateAuthorDetails(authorId, updatedData);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'Author not found.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteAuthor = createAsyncThunk(
  "authors/deleteAuthor",
  async (authorId, thunkAPI) => {
    try {
      const response = await AuthorService.deleteAuthor(authorId);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'Author not found. It may have already been deleted.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  authors: [],
  page: null,
  currentAuthor: null,
  loading: false,
  error: null
};

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuthor = action.payload;
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuthorsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.data;
      })
      .addCase(fetchAuthorsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload);
      })
      .addCase(addAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.authors.findIndex(author => author.id === action.payload.id);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.filter(author => author.id !== action.meta.arg);
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authorSlice.reducer;