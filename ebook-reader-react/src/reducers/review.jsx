import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ReviewService from "../services/review.service";
import { setMessage } from "./message";

export const fetchReviewsByBookId = createAsyncThunk(
  "review/fetchReviewsByBookId",
  async ({ bookId, filters }, thunkAPI) => {
    try {
      const response = await ReviewService.getReviewsByBookId(bookId, filters);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching reviews.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchReviewStatsByBookId = createAsyncThunk(
  "review/fetchReviewStatsByBookId",
  async (bookId, thunkAPI) => {
    try {
      const response = await ReviewService.getReviewStatsByBookId(bookId);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching review statistics.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ bookId, reviewData }, thunkAPI) => {
    try {
      const response = await ReviewService.addReview(bookId, reviewData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding the review.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ bookId, reviewId, updatedData }, thunkAPI) => {
    try {
      const response = await ReviewService.updateReview(
        bookId,
        reviewId,
        updatedData,
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the review.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateReviewHelpfulCount = createAsyncThunk(
  "review/updateReviewHelpfulCount",
  async ({ bookId, reviewId }, thunkAPI) => {
    try {
      const response = await ReviewService.updateReviewHelpfulCount(
        bookId,
        reviewId,
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the helpful count.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async ({ bookId, reviewId }, thunkAPI) => {
    try {
      await ReviewService.deleteReview(bookId, reviewId);
      return { bookId, reviewId };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the review.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  reviews: [],
  stats: {},
  selectedReview: null,
  isFetching: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByBookId.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
        state.isFetching = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByBookId.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchReviewStatsByBookId.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchReviewStatsByBookId.fulfilled, (state, action) => {
        state.isFetching = false;
        state.stats = action.payload;
      })
      .addCase(fetchReviewStatsByBookId.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(addReview.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isAdding = false;
        state.reviews.unshift(action.payload);

        const newRating = action.payload.rating;
        const prevTotal = state.stats.totalReviews ?? 0;
        const preAvg = state.stats.averageRating ?? 0;
        const newTotal = prevTotal + 1;

        state.stats.totalReviews = newTotal;
        state.stats.averageRating =
          (preAvg * prevTotal + newRating) / newTotal;

        if(state.stats.ratingDistribution) {
          state.stats.ratingDistribution[newRating] =
            (state.stats.ratingDistribution[newRating] ?? 0) + 1;
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isAdding = false;
      })
      .addCase(updateReview.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.selectedReview = action.payload;
      })
      .addCase(updateReview.rejected, (state) => {
        state.isUpdating = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.reviews = state.reviews.filter(
          (review) => review.reviewId !== action.payload.reviewId,
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isDeleting = false;
      })
      .addCase(updateReviewHelpfulCount.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateReviewHelpfulCount.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.selectedReview = action.payload;
      })
      .addCase(updateReviewHelpfulCount.rejected, (state) => {
        state.isUpdating = false;
      });
  },
});

export default reviewSlice.reducer;