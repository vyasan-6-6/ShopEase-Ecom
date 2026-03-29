import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../../services";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk("auth/registerUser", async (data, { rejectWithValue }) => {
    try {
        await authAPI.resgister(data);
        return { email: data.email };
    } catch (error) {
        return rejectWithValue(error.response?.data.message || error.message);
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
    try {
        const res = await authAPI.verifyRegisterOtp({ email, otp });
        return res; //{user,token} present
    } catch (error) {
        return rejectWithValue(error.response?.data.message || error.message);
    }
});
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        step: "form",
        email: null,
        cooldown: 0,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        startCooldown: (state) => {
            state.cooldown = 60;
        },
        tickCooldown: (state) => {
            if (state.cooldown > 0) state.cooldown -= 1;
        },
        resetAuthFlow: (state) => {
            ((state.step = "form"), (state.email = null), (state.cooldown = 0));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                ((state.loading = true), (state.error = null));
            })
            .addCase(registerUser.rejected, (state, action) => {
                ((state.loading = false), (state.error = action.payload.error), toast.error(action.payload.error));
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                ((state.loading = false),
                    (state.step = "otp"),
                    (state.cooldown = 60),
                    (state.email = action.payload.email),
                    toast.success("Register Successfull"));
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                ((state.loading = false), (state.user = action.payload.user), (state.step = "verified"));
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                ((state.loading = false), (state.error = action.payload), toast.error("Invalid OTP"));
            });
    },
});

export const { clearError, tickCooldown, resetAuthFlow, startCooldown } = authSlice.actions;
export default authSlice.reducer;
