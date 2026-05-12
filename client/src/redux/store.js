import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/auth/authSlice"
import adminAuthReducer from "./features/auth/adminAuthSlice"
import categoryReducer from "./features/category/categorySlice"
import productReducer from "./features/product/productSlice"
import cartReducer from "./features/cart/cartSlice"
import couponReducer from "./features/coupon/couponSlice"
import orderReducer from "./features/order/orderSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        category: categoryReducer,
        product: productReducer,
        cart: cartReducer,
        coupon: couponReducer,
        order: orderReducer
    }
})