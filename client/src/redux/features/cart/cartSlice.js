import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../../services/CartService";

// Async Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const res = await cartApi.getCart();
        console.log("API Response :",res.data);
        return res.data; // This is the cart object { items: [...] }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addItemToCart = createAsyncThunk("cart/addItem", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await cartApi.addToCart(productId, quantity);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateCartItemQuantity = createAsyncThunk("cart/updateQuantity", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await cartApi.updateQuantity(productId, quantity);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const removeItemFromCart = createAsyncThunk("cart/removeItem", async (productId, { rejectWithValue }) => {
    try {
        const res = await cartApi.removeFromCart(productId);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const clearUserCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
    try {
        const res = await cartApi.clearCart();
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const getCartFromStorage = () => {
    try {
        const item = window.localStorage.getItem("cartItems");
        return item ? JSON.parse(item) : [];
    } catch (error) {
        return [];
    }
};

const saveCartToStorage = (items) => {
    try {
        window.localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
        console.error("Error saving cart", error);
    }
};

const initialState = {
    items: getCartFromStorage(),
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCartLocal: (state, action) => {
            const { productId, product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => 
                item?.product && (item.product.id || item.product._id) === productId
            );
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ product, quantity });
            }
            saveCartToStorage(state.items);
        },
        removeFromCartLocal: (state, action) => {
            state.items = state.items.filter(item => 
                item?.product && (item.product.id || item.product._id) !== action.payload
            );
            saveCartToStorage(state.items);
        },
        updateQuantityLocal: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(item => 
                item?.product && (item.product.id || item.product._id) === productId
            );
            if (existingItem) {
                existingItem.quantity = quantity;
                saveCartToStorage(state.items);
            }
        },
        clearCartLocal: (state) => {
            state.items = [];
            window.localStorage.removeItem("cartItems");
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                saveCartToStorage(state.items);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Item
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                saveCartToStorage(state.items);
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Quantity
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                saveCartToStorage(state.items);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove Item
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                saveCartToStorage(state.items);
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear Cart
            .addCase(clearUserCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearUserCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                window.localStorage.removeItem("cartItems");
            })
            .addCase(clearUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { 
    addToCartLocal, 
    removeFromCartLocal, 
    updateQuantityLocal, 
    clearCartLocal 
} = cartSlice.actions;
export default cartSlice.reducer;
