import { adminApi } from "../../../services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loginAdmin = createAsyncThunk('adminAuth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await adminApi.loginAdmin(data);
        return res.data.admin; 
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

export const getAdminProfile = createAsyncThunk("adminAuth/getProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await adminApi.getProfile();
        return res.data.admin; 
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

export const updateAdminProfile = createAsyncThunk("adminAuth/updateProfile", async (data, { rejectWithValue }) => {
    try {
        const res = await adminApi.updateProfile(data);
        return res.data.admin;
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

const initialState = {
    admin: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        adminLogout: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearAdminError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.admin = action.payload;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Profile
            .addCase(getAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.admin = action.payload;
            })
            .addCase(getAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Update
            .addCase(updateAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(updateAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { adminLogout, clearAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
