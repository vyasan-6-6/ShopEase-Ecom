export const selectAuth = (state)=>state.auth;
export const selectUser = (state)=>state.user;
export const selectAuthLoading = (state)=>state.auth.loading;
export const selectAuthError = (state)=>state.auth.error;
export const selectAuthStep = (state)=>state.auth.step;
export const selectAuthEmail = (state)=>state.auth.email;
export const selectCooldown = (state)=>state.auth.cooldown;
export const selectIsAuthenticated = (state)=>!!state.auth.user;//!! converts any value into a boolean:!!null → false,!!undefined → false,!!{} → true
export const selectRegisterFlow = (state)=>state.auth.registerFlow;
export const selectForgotFlow = (state)=>state.auth.forgotFlow;


