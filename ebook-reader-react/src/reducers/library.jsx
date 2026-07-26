import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as LibraryService from "../services/library.service";
import { setMessage } from "./message";

export const getAllLibraryItems = createAsyncThunk(
  "library/getAllLibraryItems",
  async (filters, thunkAPI) => {
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
  async (bookId, thunkAPI) => {
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
  async ({ bookId, isFavorite }, thunkAPI) => {
    try {
      const response = await LibraryService.toggleFavoriteStatus(
        bookId,
        isFavorite,
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

export const revokeLibraryAccessItem = createAsyncThunk(
  "library/revokeLibraryAccessItem",
  async ({ userId, bookId }, thunkAPI) => {
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
};

const LibrarySlice = createSlice({
  name: "library",
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
        console.log(
          "action.payload.data.content: ",
          action.payload.data.content,
        );
        state.items = action.payload.data.content;
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
      .addCase(toggleFavoriteItem.pending, (state, action) => {
        state.error = null;
        const { bookId, isFavorite } = action.meta.arg || {};
        const index = state.items.findIndex(
          (item) => item.book?.bookId === bookId,
        );
        if (index !== -1 && typeof isFavorite === "boolean") {
          state.items[index].isFavorite = isFavorite;
        }
      })
      .addCase(toggleFavoriteItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        if (updatedItem && typeof updatedItem === "object") {
          const index = state.items.findIndex(
            (item) => item.book?.bookId === updatedItem.bookId,
          );
          if (index !== -1) {
            state.items[index] = updatedItem;
          }
        }
      })
      .addCase(toggleFavoriteItem.rejected, (state, action) => {
        state.error = action.payload;
        const { bookId, isFavorite } = action.meta.arg || {};
        const index = state.items.findIndex(
          (item) => item.book?.bookId === bookId,
        );
        if (index !== -1 && typeof isFavorite === "boolean") {
          state.items[index].isFavorite = !isFavorite;
        }
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
