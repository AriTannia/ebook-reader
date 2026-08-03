import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as UserService from "../services/user.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getUserById(userId);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'User not found.' });
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
      const message = getErrorMessage(error);
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
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await UserService.getAllUsers(filters);
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.createUser(userData);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 409: 'A user with this email already exists.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ userId, roleData }, thunkAPI) => {
    try {
      const response = await UserService.updateUserRole(userId, roleData);
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, { 404: 'User not found.' });
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
      const message = getErrorMessage(error, { 404: 'User not found. They may have already been deleted.' });
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  users: [],
  page: null,
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
      .addCase(fetchUserById.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isFetching = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
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
      .addCase(fetchAllUsers.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isFetching = false;
        state.page = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (!state.users) {
          state.users = [];
        }
        state.users.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedUser = action.payload.data;
        if (state.users) {
          const index = state.users.findIndex(
            (user) => user.id === updatedUser.id,
          );
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
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
        if (state.users) {
          state.users = state.users.filter(
            (user) => user.id !== action.payload.data.id,
          );
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
