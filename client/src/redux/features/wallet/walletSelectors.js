export const selectWalletBalance = (state) => state.wallet?.balance || 0;
export const selectWalletTransactions = (state) => state.wallet?.transactions || [];
export const selectWalletLoading = (state) => state.wallet?.loading || false;
