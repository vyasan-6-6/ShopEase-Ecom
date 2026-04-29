export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
 