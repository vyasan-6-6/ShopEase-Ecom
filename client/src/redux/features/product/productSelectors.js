export const selectAdminProducts = (state) => state.product.adminItems;
export const selectPublicProducts = (state) => state.product.publicItems;
export const selectProductLoading = (state) => state.product.isLoading;
export const selectProductSubmitting = (state) => state.product.isSubmitting;
export const selectProductError = (state) => state.product.error;
