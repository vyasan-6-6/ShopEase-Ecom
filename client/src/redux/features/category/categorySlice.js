import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryApi } from "../../../services";

export const fetchCategories = createAsyncThunk(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await categoryApi.getAllCategories();
            return res.data?.categories || [];
        } catch (err) {
            return rejectWithValue(err.message);
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
            return rejectWithValue(err.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await categoryApi.updateCategory(id, data);
            return res.data?.category;  //?is added just in case the response doesn't have category
        } catch (err) {
            return rejectWithValue(err.message);
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
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    items: [
        {
            id: "cat_1",
            name: "Electronics",
            description: "Latest gadgets, smartphones, and computers.",
            slug: "electronics",
            status: "active",
            createdAt: new Date("2024-01-15").toISOString(),
        },
        {
            id: "cat_2",
            name: "Fashion",
            description: "Trendy clothing and accessories for men and women.",
            slug: "fashion",
            status: "active",
            createdAt: new Date("2024-02-10").toISOString(),
        },
        {
            id: "cat_3",
            name: "Home & Kitchen",
            description: "Essential appliances and decor for your home.",
            slug: "home-kitchen",
            status: "active",
            createdAt: new Date("2024-03-05").toISOString(),
        },
        {
            id: "cat_4",
            name: "Books",
            description: "A wide collection of fiction and non-fiction books.",
            slug: "books",
            status: "inactive",
            createdAt: new Date("2024-03-20").toISOString(),
        },
        {
            id: "cat_5",
            name: "Beauty & Health",
            description: "Skincare, makeup, and wellness products.",
            slug: "beauty-health",
            status: "active",
            createdAt: new Date("2024-04-12").toISOString(),
        },
    ],
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
            .addCase(createCategory.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.isSubmitting = false;
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
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
