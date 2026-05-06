import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryApi } from "../../../services";

export const fetchCategories = createAsyncThunk(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await categoryApi.getAllCategories();
            return res.data?.categories || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createCategory = createAsyncThunk(
    "category/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await categoryApi.createCategory(data);
            return res.data?.category;  //?is added just in case the response doesn't have category
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await categoryApi.updateCategory(id, data);
            return res.data?.category;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/delete",
    async (id, { rejectWithValue }) => {
        try {
            await categoryApi.deleteCategory(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const initialState = {
    items: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isSubmitting = false;
                if (action.payload) {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isSubmitting = false;
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {//it means the updated category is present in the list ,-1 means not present
                    state.items[index] = action.payload    //replace the old value with the updated one
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteCategory.pending, (state) => {
                // We could track individual deleting IDs if needed
                state.isSubmitting = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
