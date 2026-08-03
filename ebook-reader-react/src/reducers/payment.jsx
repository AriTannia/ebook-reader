import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as PayementService from "../services/payment.service";
import { setMessage } from "./message";
import { getErrorMessage } from "../utils/errorHandler";

export const createPaymentIntent = createAsyncThunk(
    "payment/createPaymentIntent",
    async ({orderId, provider}, thunkAPI) => {
        try {
            const response = await PayementService.createPaymentIntent(orderId, provider);
            return response.data;
        } catch (error) {
            const message = getErrorMessage(error);
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPaymentsByOrderId = createAsyncThunk(
    "payment/getPaymentsByOrderId",
    async (orderId, thunkAPI) => {
        try {
            const response = await PayementService.getPaymentsByOrderId(orderId);
            return response.data;
        } catch (error) {
            const message = getErrorMessage(error);
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    paymentIntent: null,
    payments: [],
    loading: false,
    error: null
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentIntent = action.payload;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPaymentsByOrderId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentsByOrderId.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(getPaymentsByOrderId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default paymentSlice.reducer;