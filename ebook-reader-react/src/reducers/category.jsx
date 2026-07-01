import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CategoryService from "../services/category.service";
import { setMessage } from "./message";

export const fetchAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const response = await CategoryService.getAllCategories();
      return response.data.data;
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

export const fetchCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (categoryId, thunkAPI) => {
    try {
      const response = await CategoryService.getCategoryById(categoryId);
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

export const fetchAllCategoriesForAdmin = createAsyncThunk(
  "category/getAllCategoriesForAdmin",
  async (filters, thunkAPI) => {
    try {
      const response = await CategoryService.getAllCategoriesForAdmin(filters);
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

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await CategoryService.createCategory(categoryData);
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, categoryData }, thunkAPI) => {
    try {
      const response = await CategoryService.updateCategory(
        categoryId,
        categoryData,
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, thunkAPI) => {
    try {
      const response = await CategoryService.deleteCategory(categoryId);
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
  categories: [],
  page: null,
  category: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
    })
    .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(fetchCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload;
    })
    .addCase(fetchCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchAllCategoriesForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchAllCategoriesForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
    })
    .addCase(fetchAllCategoriesForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    })
    .addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload;
    })
    .addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter((cat) => cat.id !== action.payload);
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default categorySlice.reducer;