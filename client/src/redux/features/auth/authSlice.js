import { authAPI, userApi, adminApi } from "../../../services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk("auth/registerUser", async (data, { rejectWithValue }) => {
    try {
        await authAPI.register(data);
        return { email: data.email }; // this is your payload
    } catch (error) {
        return rejectWithValue(error.message); //payload for rejected
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
    try {
        const res = await authAPI.verifyRegisterOtp({ email, otp });
        return res.data; //{user,token} present
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const resendOtp = createAsyncThunk("auth/resendOtp", async (email, { rejectWithValue }) => {
    try {
        await authAPI.resendOtp({ email });
        return true;
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (userCredentials, { rejectWithValue }) => {
    try {
        const res = await authAPI.login(userCredentials);

        return res.data.user;
    } catch (error) {
        console.log("login error:", error);
        return rejectWithValue(error?.message);
    }
});

export const googleLoginUser = createAsyncThunk("auth/googleLoginUser", async (credential, { rejectWithValue }) => {
    try {
        const res = await authAPI.googleLogin(credential);
        return { isNewUser: res.data.isNewUser, credential, ...res.data };
    } catch (error) {
        console.log("google login error:", error);
        return rejectWithValue(error?.message);
    }
});

export const googleRegisterUser = createAsyncThunk("auth/googleRegisterUser", async ({ credential, password }, { rejectWithValue }) => {
    try {
        const res = await authAPI.googleRegister(credential, password);
        return res.data.user;
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        await authAPI.forgotPassword(email);
        return email;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const verifyResetOtp = createAsyncThunk("auth/verifyResetOtp", async ({ email, otp }, { rejectWithValue }) => {
    try {
        await authAPI.verifyResetOtp({ email, otp });
        return true;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, newPassword }, { rejectWithValue }) => {
    try {
        await authAPI.resetPassword({ email, newPassword });
        return true;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// USERS

export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await authAPI.getProfile();
        console.log("getProfile user:", res);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue }) => {
    try {
        const res = await userApi.updateProfile(profileData);
        return res.data; // Return the updated user from backend!
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addAddress = createAsyncThunk("user/addAddress", async (addressData, { rejectWithValue }) => {
    try {
        const res = await userApi.addAddress(addressData);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const setDefaultAddress = createAsyncThunk("user/setDefaultAddress", async (addressId, { rejectWithValue }) => {
    try {
        const res = await userApi.setDefaultAddress(addressId);
        return res.data; // This returns the updated user array with the new default flags
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteAddress = createAsyncThunk("user/deleteAddress", async (addressId, { rejectWithValue }) => {
    try {
        const res = await userApi.deleteAddress(addressId);
        return res.data; 
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const editAddress = createAsyncThunk("user/editAddress", async ({ addressId, data }, { rejectWithValue }) => {
    try {
        const res = await userApi.editAddress(addressId, data);
        return res.data; 
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const uploadAvatar = createAsyncThunk("user/uploadAvatar", async (formData, { rejectWithValue }) => {
    try {
        const res = await userApi.uploadAvatar(formData);
        return res.data; // This is the updated user returned from the server
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
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
            state.isAuthenticated = false;
        },
        setUser: (state, action) => {
            state.isAuthenticated = true;
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

        setVerificationFlow: (state, action) => {
            state.registerFlow.step = "otp";
            state.registerFlow.email = action.payload; 
            state.registerFlow.cooldown = 60;
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
                state.error = action.payload;
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
                state.isAuthenticated = true;
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
                state.forgotFlow.cooldown = 60;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(googleLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLoginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.payload.isNewUser) {
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                }
            })
            .addCase(googleLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(googleRegisterUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleRegisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(googleRegisterUser.rejected, (state, action) => {
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
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true; // Make sure they stay authenticated!
                state.user = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false; // Log them out if the fetch fails (e.g., token expired)
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Resiliently extract user if backend wraps it in { user } or sends it direct
                state.user = action.payload?.user || action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || action.payload;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || action.payload; // Extract user regardless of wrap
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || action.payload; // Saves the fresh addresses to state
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || action.payload; 
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || action.payload; 
            })
            .addCase(editAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            
        }
     
});


export const {
    clearError,
    startForgotFlow,
    tickForgotCooldown,
    tickRegisterCooldown,
    logout,
    setUser,
    resetForgotFlow,
    startCooldown, setVerificationFlow,
} = authSlice.actions;
export default authSlice.reducer;
