import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../../services";

export const registerUser = createAsyncThunk("auth/registerUser", async (data, { rejectWithValue }) => {
    try {
        await authAPI.register(data);
        return { email: data.email };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
    try {
        const res = await authAPI.verifyRegisterOtp({ email, otp });
        return res.data; //{user,token} present
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const resendOtp = createAsyncThunk("auth/resendOtp", async (email, { rejectWithValue }) => {
    try {
        await authAPI.resendOtp({ email });
        return true;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (data, { rejectWithValue }) => {
    try {
        const res = await authAPI.login(data);
        return res.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        await authAPI.forgotPassword(email);
        return email;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const verifyResetOtp = createAsyncThunk("auth/verifyResetOtp", async ({ email, otp }, { rejectWithValue }) => {
    try {
        await authAPI.verifyResetOtp({ email, otp });
        return true;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, password }, { rejectWithValue }) => {
    try {
        await authAPI.resetPassword({ email, password });
        return true;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const initialState = {
    user: null,
    loading: false,
    error: null,
    registerFlow: {
        step: "form",
        email: null,
        cooldown: 0,
    },
    forgotFlow: {
        step: "email",
        email: null,
        cooldown: 0,
    },
};
export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.registerFlow = initialState.registerFlow;
            state.forgotFlow = initialState.forgotFlow;
        }
        ,
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        tickRegisterCooldown: (state) => {
            if (state.registerFlow.cooldown > 0) state.registerFlow.cooldown -= 1;
        },
        tickForgotCooldown: (state) => {
            if (state.forgotFlow.cooldown > 0) state.forgotFlow.cooldown -= 1;
        },
        resetForgotFlow: (state) => {
            state.forgotFlow = initialState.forgotFlow;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.registerFlow.step = "otp";
                state.registerFlow.cooldown = 60;
                state.registerFlow.email = action.payload.email;
            })

            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.loading = false;
                state.registerFlow.cooldown = 60;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.forgotFlow.step = "otp";
                state.forgotFlow.email = action.payload;
                state.forgotFlow.cooldown = 60;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(verifyResetOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyResetOtp.fulfilled, (state) => {
                state.loading = false;
                state.forgotFlow.step = "reset";
            })
            .addCase(verifyResetOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.forgotFlow.step = "done";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError,startForgotFlow,tickForgotCooldown,tickRegisterCooldown, logout, setUser, resetForgotFlow, startCooldown } = authSlice.actions;
export default authSlice.reducer;
