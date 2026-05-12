import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../../../services";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await orderApi.createOrder(orderData);
            console.log("res from orderSlice",res);
            return res.data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "order/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const res = await orderApi.verifyPayment(paymentData);
            console.log("res from orderSlice verifyPayment",res);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    "order/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderApi.getMyOrders();
            console.log("res from orderSlice fetchMyOrders",res);
            return res.data.orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload; // contains order, razorpayOrderId, etc.
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify Payment
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentOrder) {
                    state.currentOrder.order = action.payload.order;
                }
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch My Orders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
