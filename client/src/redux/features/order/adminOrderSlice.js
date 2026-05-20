import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../../services/AdminService";

export const fetchAllOrders = createAsyncThunk(
    "adminOrder/fetchAllOrders",
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminApi.getAllOrders(params);
            return response.data.orders;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "adminOrder/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await adminApi.updateOrderStatus(orderId, status);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update order status"
            );
        }
    }
);

const initialState = {
    orders: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
};

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {
        clearAdminOrderError: (state) => {
            state.error = null;
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                // Update the specific order in the list
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            });
    },
});

export const { clearAdminOrderError } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
