import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CartService from "../services/cart.service";
import { setMessage } from "./message";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await CartService.getCart();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching the cart.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, thunkAPI) => {
    try {
      const response = await CartService.addCartItem(cartData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding the book to the cart.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, thunkAPI) => {
    try {
      const response = await CartService.removeCartItem(cartItemId);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while removing the book from the cart.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await CartService.clearCart();
      return;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while clearing the cart.";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  cart: {
    cartId: null,
    items: [],
    totalPrice: 0,
  },
  loading: false,
  removingItemId: null,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state, action) => {
        state.removingItemId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
        state.removingItemId = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.removingItemId = null;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = {
          cartId: null,
          items: [],
          totalPrice: 0,
        };
        state.removingItemId = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.removingItemId = null;
      });
  },
});

export default cartSlice.reducer;
