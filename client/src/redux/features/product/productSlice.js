import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../../services";

export const fetchAdminProducts = createAsyncThunk(
    "product/fetchAllAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const res = await productApi.getAllAdminProducts();
            return res.data?.products || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchPublicProducts = createAsyncThunk(
    "product/fetchPublic",
    async (params, { rejectWithValue }) => {
        try {
            const res = await productApi.getAllProducts(params);
            return {
                products: res.data?.products || [],
                pagination: res.data?.pagination || null
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    "product/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await productApi.createProduct(data);
            return res.data?.product;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await productApi.updateProduct(id, data);
            return res.data?.product;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (id, { rejectWithValue }) => {
        try {
            await productApi.deleteProduct(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const uploadProductImages = createAsyncThunk(
    "product/uploadImages",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await productApi.uploadImages(formData);
            return res.data?.urls || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "product/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await productApi.getProductById(id);
            return res.data?.product;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const initialState = {
    adminItems: [],
    publicItems: [],
    selectedProduct: null, 
    pagination: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Admin Products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminItems = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch Public Products
            .addCase(fetchPublicProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.publicItems = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchPublicProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isSubmitting = false;
                if (action.payload) {
                    state.adminItems.unshift(action.payload);
                }
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isSubmitting = false;
                if (action.payload) {
                    const index = state.adminItems.findIndex((p) => p.id === action.payload.id);
                    if (index !== -1) {
                        state.adminItems[index] = action.payload;
                    }
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.adminItems = state.adminItems.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })
            
            // Upload Images
            .addCase(uploadProductImages.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(uploadProductImages.fulfilled, (state) => {
                state.isSubmitting = false; 
            })
            .addCase(uploadProductImages.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
