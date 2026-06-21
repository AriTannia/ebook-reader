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
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(username, email, password);
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

export const logout = createAsyncThunk(
    "auth/logout", async () => {
        await AuthService.logout();
    }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
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
      });
    },
});

export default authSlice.reducer;