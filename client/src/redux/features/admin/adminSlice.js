import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../services"; 
export const getProfile = createAsyncThunk("admin/getProfile",async(_,{rejectWithValue})=>{
try {
    const res = await adminApi.getProfile();
    return res.data.admin;
} catch (error) {
    return rejectWithValue(error?.message);
}
});
export const loginAdmin = createAsyncThunk('admin/login',async(data,{rejectWithValue})=>{
try {
    const res = await adminApi.loginAdmin(data);
    return res.data.admin;
} catch (error) {
    return rejectWithValue(error?.message);
}
});



const initialState = {
  dashboard: null,
admin:null,
  users: [],
  usersLoading: false,

  loading: false,
  error: null,
};

const adminSlice = createSlice({
    name:"admin",
    initialState:initialState,
    reducers:{
        clearAdminError:(state)=>{
            state.error = null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginAdmin.pending,(state)=>{
            state.loading= true;
            state.error=null;
        })
        .addCase(loginAdmin.fulfilled,(state,action)=>{
            state.loading= false;
            state.admin = action.payload;
        })
        .addCase(loginAdmin.rejected,(state,action)=>{
            state.loading= false;
            state.error=action.payload;
        })
        .addCase(getProfile.pending,(state)=>{
            state.loading= true;
            state.error=null;
        })
        .addCase(getProfile.fulfilled,(state,action)=>{
            state.loading= false;
            state.admin=action.payload;
        })
        .addCase(getProfile.rejected,(state,action)=>{
            state.loading= false;
            state.error=action.payload;
        })

    }
});

export const {clearAdminError} = adminSlice.actions;
export default adminSlice.reducer;