// Base selector for the admin slice
export const selectAdminState = (state) => state.admin;
// Individual property selectors
export const selectAdminUser = (state) => state.admin.admin;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
// Dashboard & User Management selectors
export const selectAdminDashboard = (state) => state.admin.dashboard;
export const selectAdminUsersList = (state) => state.admin.users;
export const selectAdminUsersLoading = (state) => state.admin.usersLoading;