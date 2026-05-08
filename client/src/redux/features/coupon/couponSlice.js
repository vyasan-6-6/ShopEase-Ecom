 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { couponApi } from "../../../services";

export const fetchCoupons = createAsyncThunk(
    "coupon/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await couponApi.getAllCoupons();
            return res.data.coupons;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCoupon = createAsyncThunk(
    "coupon/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await couponApi.createCoupon(data);
            return res.data.coupon;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCoupon = createAsyncThunk(
    "coupon/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await couponApi.updateCoupon(id, data);
            return res.data.coupon;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    "coupon/delete",
    async (id, { rejectWithValue }) => {
        try {
            await couponApi.deleteCoupon(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const validateCoupon = createAsyncThunk(
    "coupon/validate",
    async ({ code, cartTotal }, { rejectWithValue }) => {
        try {
            const res = await couponApi.validateCoupon(code, cartTotal);
            return res.data.coupon;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    coupons: [],
    loading: false,
    error: null,
    validating: false,
    validatedCoupon: null, // Stores the applied coupon during checkout
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        clearCouponError: (state) => {
            state.error = null;
        },
        clearValidatedCoupon: (state) => {
            state.validatedCoupon = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload || action.payload.data?.coupons; // fallback
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons.unshift(action.payload?.data?.coupon || action.payload);
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.coupons.findIndex((c) => (c.id || c._id) === (action.payload.id || action.payload._id));
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = state.coupons.filter((c) => (c.id || c._id) !== action.payload);
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Validate
            .addCase(validateCoupon.pending, (state) => {
                state.validating = true;
                state.error = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.validating = false;
                state.validatedCoupon = action.payload;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.validating = false;
                state.error = action.payload;
            });
    },
});

export const { clearCouponError, clearValidatedCoupon } = couponSlice.actions;
export default couponSlice.reducer;
