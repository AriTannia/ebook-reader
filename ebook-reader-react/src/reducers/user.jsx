import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as UserService from "../services/user.service";
import { setMessage } from "./message";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getUserProfile(userId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching user profile.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, profileData }, thunkAPI) => {
    try {
      const response = await UserService.updateUserProfile(userId, profileData);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating user profile.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserAvatar = createAsyncThunk(
  "user/updateUserAvatar",
  async ({ userId, avatarData }, thunkAPI) => {
    try {
      const response = await UserService.updateUserAvatar(userId, avatarData);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating user avatar.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await UserService.deleteUser(userId);
      return userId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting the user.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  profile: null,
  isFetching: false,
  isUpdating: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isFetching = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      .addCase(updateUserAvatar.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.data;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
