import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as TagService from "../services/tag.service";
import { setMessage } from "./message";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, thunkAPI) => {
    try {
      const response = await TagService.getAllTags();
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching tags.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchTagById = createAsyncThunk(
  "tags/fetchTagById",
  async (tagId, thunkAPI) => {
    try {
      const response = await TagService.getTagById(tagId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching the tag.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchTagsForAdmin = createAsyncThunk(
  "tags/fetchTagsForAdmin",
  async (filters, thunkAPI) => {
    try {
      const response = await TagService.getAllTagsForAdmin(filters);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching tags for admin.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addTag = createAsyncThunk(
  "tags/addTag",
  async (tagData, thunkAPI) => {
    try {
      const response = await TagService.addNewTag(tagData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding the tag.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ tagId, tagData }, thunkAPI) => {
    try {
      const response = await TagService.updateTagDetails(tagId, tagData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the tag.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (tagId, thunkAPI) => {
    try {
      const response = await TagService.deleteTag(tagId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the tag.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  tags: [],
  page: null,
  currentTag: null,
  loading: false,
  error: null
};

const tagSlice = createSlice({
    name: "tags",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTags.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTags.fulfilled, (state, action) => {
            state.loading = false;
            state.tags = action.payload;
        })
        .addCase(fetchTags.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchTagById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTagById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentTag = action.payload;
        })
        .addCase(fetchTagById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchTagsForAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTagsForAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.page = action.payload.data;
        })
        .addCase(fetchTagsForAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addTag.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addTag.fulfilled, (state, action) => {
            state.loading = false;
            state.tags.push(action.payload);
        })
        .addCase(addTag.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateTag.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateTag.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tags.findIndex(tag => tag.id === action.payload.id);
            if (index !== -1) {
                state.tags[index] = action.payload;
            }
        })
        .addCase(updateTag.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteTag.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(deleteTag.fulfilled, (state, action) => {
            state.loading = false;
            state.currentTag = action.payload;
        })
        .addCase(deleteTag.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default tagSlice.reducer;