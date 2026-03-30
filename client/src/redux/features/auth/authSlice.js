import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../../services";
import { toast } from "react-toastify";

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
        return res; //{user,token} present
    } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const resentOtp = createAsyncThunk("auth/resent-otp", async (email, { rejectWithValue }) => {
    try {
        await authAPI.register({ email });
        return true;
    } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const loginUser = createAsyncThunk("auth/loginUser",async(data,{rejectWithValue})=>{
    try {
        const res = await authAPI.login(data);
        return res.data.user;
    } catch (error) {
           return rejectWithValue(error.response?.data?.message || error.message);
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
        isAuthChecked:false
    },
    reducers: {
        logout:(state)=>{
            state.user= null,
            state.email=null,
            state.step="form"
        },
        setUser:(state,action)=>{
            state.user = action.payload;
        },
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
            })
            .addCase(resentOtp.pending, (state) => {
                ((state.loading = true), (state.error = null));
            })
            .addCase(resentOtp.rejected, (state, action) => {
                ((state.loading = false), (state.error = action.payload));
            })
            .addCase(resentOtp.fulfilled, (state, action) => {
                ((state.loading = false), (state.cooldown = 60));
            })
            .addCase(loginUser.pending,(state)=>{
                state.loading=true,
                state.error=null
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading=false,
                state.user=action.payload,
                state.step= "authenticated"
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload
            })
            
    }
});

export const { clearError, tickCooldown,logout,setUser, resetAuthFlow, startCooldown } = authSlice.actions;
export default authSlice.reducer;
