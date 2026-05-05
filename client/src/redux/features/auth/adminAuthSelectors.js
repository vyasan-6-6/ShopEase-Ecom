export const selectAdmin = (state) => state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAuthenticated;
export const selectAdminLoading = (state) => state.adminAuth.loading;
export const selectAdminError = (state) => state.adminAuth.error;
