import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as AuthService from '../services/auth.service';
import { setMessage } from './message';

const getAuthErrorMessage = (error) => {
  const response = error.response?.data;

  if (response?.codeNumber === 401 || response?.codeStatus === 'Unauthorized') {
    return 'Incorrect email or password. Please try again.';
  }

  return (
    response?.message ||
    error.message ||
    'An error occurred. Please try again.'
  );
};

export const register = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(fullName, email, password);
      return response.data;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await AuthService.login(email, password);
      console.log("Login response:", response);
      return response.data;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const response = await AuthService.refreshToken();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword);
      return response.data;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await AuthService.forgotPassword(email);
      return response.data;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const response = await AuthService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
    "auth/logout", async () => {
        await AuthService.logout();
    }
)

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      const response = await AuthService.getCurrentUser();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: true
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload?.data || action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload?.data || action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || action.payload;
      })
      .addCase(changePassword.rejected, (state) => {
        state.loading = false;
      })  
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload?.data || action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
      });
    },
});

export default authSlice.reducer;