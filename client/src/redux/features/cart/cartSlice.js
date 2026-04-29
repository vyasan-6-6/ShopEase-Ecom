import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
    try {
        const item = window.localStorage.getItem("cartItems");
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading cart from localStorage", error);
        return [];
    }
};
 
const saveCartToStorage = (items) => {
    try {
        window.localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
        console.error("Error saving cart to localStorage", error);
    }
};

const initialState = {
    items: getCartFromStorage(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId, name, price, quantity = 1, image } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ productId, name, price, quantity, image });
            }
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
            saveCartToStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                if (quantity > 0) {
                    existingItem.quantity = quantity;
                } else {
                    // Remove if quantity drops to 0
                    state.items = state.items.filter(item => item.productId !== productId);
                }
                saveCartToStorage(state.items);
            }
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToStorage(state.items);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
