import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as LibraryService from "../services/library.service";
import { setMessage } from "./message";

export const getAllLibraryItems = createAsyncThunk(
  "library/getAllLibraryItems",
  async (filters, { rejectWithValue, dispatch }) => {
    try {
      const response = await LibraryService.getAllLibraryItems(filters);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const checkLibraryItemExists = createAsyncThunk(
  "library/checkLibraryItemExists",
  async (bookId, { rejectWithValue, dispatch }) => {
    try {
      const response = await LibraryService.checkLibraryItemExists(bookId);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const toggleFavoriteItem = createAsyncThunk(
  "library/toggleFavoriteItem",
  async (bookId, { rejectWithValue, dispatch }) => {
    try {
      const response = await LibraryService.toggleFavoriteStatus(bookId);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const revokeLibraryAccessItem = createAsyncThunk(
  "library/revokeLibraryAccessItem",
  async ({ userId, bookId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await LibraryService.revokeLibraryItemAccess(
        userId,
        bookId,
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
}

const LibrarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllLibraryItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllLibraryItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getAllLibraryItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(checkLibraryItemExists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkLibraryItemExists.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload;
            })
            .addCase(checkLibraryItemExists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleFavoriteItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavoriteItem.fulfilled, (state, action) => {
                state.loading = false;
                const updatedItem = action.payload;
                const index = state.items.findIndex(
                    (item) => item.bookId === updatedItem.bookId,
                );
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
            })
            .addCase(toggleFavoriteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(revokeLibraryAccessItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(revokeLibraryAccessItem.fulfilled, (state, action) => {
                state.loading = false;
                const revokedItemId = action.payload.bookId;
                state.items = state.items.filter(
                    (item) => item.bookId !== revokedItemId,
                );
            })
            .addCase(revokeLibraryAccessItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default LibrarySlice.reducer;