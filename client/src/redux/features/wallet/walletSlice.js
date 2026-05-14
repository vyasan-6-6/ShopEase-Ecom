import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import WalletService from "../../../services/WalletService";

export const fetchWallet = createAsyncThunk(
    "wallet/fetchWallet",
    async (_, { rejectWithValue }) => {
        try {
            const res = await WalletService.getWallet();
            return res.data.wallet;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const walletSlice = createSlice({
    name: "wallet",
    initialState: {
        balance: 0,
        transactions: [],
        loading: false,
        error: null,
    },
    reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(fetchWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload?.balance || 0;
                state.transactions = action.payload?.transactions || [];
            })
            .addCase(fetchWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default walletSlice.reducer;
