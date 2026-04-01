import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../services"; 

export const loginAdmin = createAsyncThunk('admin/login',async(data,{rejectWithValue})=>{
try {
    const res = await adminApi.adminLogin(data);
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
    }
});

export const {clearAdminError} = adminSlice.actions;
export default adminSlice.reducer;