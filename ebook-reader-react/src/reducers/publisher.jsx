import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as PublisherService from "../services/publisher.service";
import { setMessage } from "./message";

export const fetchPublishers = createAsyncThunk(
  "publishers/fetchPublishers",
  async (_, thunkAPI) => {
    try {
      const response = await PublisherService.getAllPublishers();
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching publishers.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchPublisherById = createAsyncThunk(
  "publishers/fetchPublisherById",
  async (publisherId, thunkAPI) => {
    try {
      const response = await PublisherService.getPublisherById(publisherId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching the publisher.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchPublishersForAdmin = createAsyncThunk(
  "publishers/fetchPublishersForAdmin",
  async (filters, thunkAPI) => {
    try {
      const response = await PublisherService.getAllPublishersForAdmin(filters);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching publishers for admin.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addPublisher = createAsyncThunk(
  "publishers/addPublisher",
  async (publisherData, thunkAPI) => {
    try {
      const response = await PublisherService.addNewPublisher(publisherData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding the publisher.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updatePublisher = createAsyncThunk(
  "publishers/updatePublisher",
  async ({ publisherId, publisherData }, thunkAPI) => {
    try {
      const response = await PublisherService.updatePublisher(
        publisherId,
        publisherData,
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the publisher.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deletePublisher = createAsyncThunk(
  "publishers/deletePublisher",
  async (publisherId, thunkAPI) => {
    try {
      const response = await PublisherService.deletePublisher(publisherId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the publisher.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
    publishers: [],
    page: null,
    publisher: null,
    loading: false,
    error: null,
}

const publisherSlice = createSlice({
    name: "publishers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublishers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublishers.fulfilled, (state, action) => {
                state.loading = false;
                state.publishers = action.payload;
            })
            .addCase(fetchPublishers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPublisherById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublisherById.fulfilled, (state, action) => {
                state.loading = false;
                state.publisher = action.payload;
            })
            .addCase(fetchPublisherById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPublishersForAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublishersForAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.data;
            })
            .addCase(fetchPublishersForAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPublisher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPublisher.fulfilled, (state, action) => {
                state.loading = false;
                state.publishers.push(action.payload);
            })
            .addCase(addPublisher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePublisher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePublisher.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.publishers.findIndex(
                    (publisher) => publisher.id === action.payload.id,
                );
                if (index !== -1) {
                    state.publishers[index] = action.payload;
                }
            })
            .addCase(updatePublisher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePublisher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePublisher.fulfilled, (state, action) => {
                state.loading = false;
                state.publishers = state.publishers.filter(
                    (publisher) => publisher.id !== action.payload,
                );
            })
            .addCase(deletePublisher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default publisherSlice.reducer;