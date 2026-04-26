export const selectAllProducts = (state) => state.product.items;
export const selectProductLoading = (state) => state.product.isLoading;
export const selectProductSubmitting = (state) => state.product.isSubmitting;
export const selectProductError = (state) => state.product.error;
