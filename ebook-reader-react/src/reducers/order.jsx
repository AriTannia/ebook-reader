import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as OrderService from "../services/order.service";
import { setMessage } from "./message";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (_, thunkAPI) => {
        try {
            const response = await OrderService.createOrder();
            return response.data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            throw error;
        }
    }
);

export const getMyOrders = createAsyncThunk(
    "order/getMyOrders",
    async (filters, thunkAPI) => {
        try {
            const response = await OrderService.getMyOrders(filters);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            throw error;
        }
    }
);

export const getMyOrderById = createAsyncThunk(
    "order/getMyOrderById",
    async (orderId, thunkAPI) => {
        try {
            const response = await OrderService.getMyOrderById(orderId);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            throw error;
        }
    }
);

export const cancelMyOrder = createAsyncThunk(
    "order/cancelMyOrder",
    async (orderId, thunkAPI) => {
        try {
            const response = await OrderService.cancelMyOrder(orderId);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            throw error;
        }
    }
);

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getMyOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getMyOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(cancelMyOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelMyOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(cancelMyOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default orderSlice.reducer;