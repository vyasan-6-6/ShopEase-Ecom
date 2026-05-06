export const selectAllCategories = (state) => state.category.items;
export const selectCategoryLoading = (state) => state.category.isLoading;
export const selectCategorySubmitting = (state) => state.category.isSubmitting;
export const selectCategoryError = (state) => state.category.error;
export const selectActiveCategories = (state) => state.category.items.filter(cat => cat.status === "active");
