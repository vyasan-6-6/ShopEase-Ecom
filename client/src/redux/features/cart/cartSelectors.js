export const selectCartItems = (state) => state.cart.items || [];
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotalCount = (state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) => 
    state.cart.items.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
    }, 0);
 