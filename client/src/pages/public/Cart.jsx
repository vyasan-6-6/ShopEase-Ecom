import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearUserCart,
    updateQuantityLocal,
    removeFromCartLocal,
    clearCartLocal
} from "../../redux/features/cart/cartSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartLoading
} from "../../redux/features/cart/cartSelectors";
import { selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { selectIsAdminAuthenticated } from "../../redux/features/auth/adminAuthSelectors";
import { validateCoupon, clearValidatedCoupon } from "../../redux/features/coupon/couponSlice";
import { selectValidatingCoupon, selectValidatedCoupon } from "../../redux/features/coupon/couponSelectors";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Shield, Ticket, X } from "lucide-react";
import { confirmDelete } from "../../utils/alerts";
import { toast } from "react-toastify";

const Cart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    const loading = useAppSelector(selectCartLoading);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);

    // Coupon State
    const validatingCoupon = useAppSelector(selectValidatingCoupon);
    const appliedCoupon = useAppSelector(selectValidatedCoupon);
    const [couponCode, setCouponCode] = useState("");

    useEffect(() => {
        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated, isAdminAuthenticated]);

    // Clear coupon if cart becomes empty or if total changes below min order amount
    useEffect(() => {
        if (appliedCoupon) {
            if (total === 0) {
                dispatch(clearValidatedCoupon());
            } else if (total < appliedCoupon.minOrderAmount) {
                toast.warning(`Cart total dropped below minimum order amount ($${appliedCoupon.minOrderAmount}) for coupon ${appliedCoupon.code}`);
                dispatch(clearValidatedCoupon());
            }
        }
    }, [total, appliedCoupon, dispatch]);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
        } else {
            dispatch(updateQuantityLocal({ productId, quantity: newQuantity }));
        }
    };

    const handleRemove = async (productId) => {
        const confirmed = await confirmDelete("Remove Item?", "Are you sure you want to remove this item from your cart?");
        if (!confirmed) return;

        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(removeItemFromCart(productId));
        } else {
            dispatch(removeFromCartLocal(productId));
        }
    };

    const handleClear = async () => {
        const confirmed = await confirmDelete("Clear Cart?", "Are you sure you want to remove all items from your cart?");
        if (!confirmed) return;

        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(clearUserCart());
        } else {
            dispatch(clearCartLocal());
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            await dispatch(validateCoupon({ code: couponCode, cartTotal: total })).unwrap();
            toast.success("Coupon applied successfully!");
            setCouponCode("");
        } catch (error) {
            toast.error(error || "Invalid coupon code");
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(clearValidatedCoupon());
        toast.info("Coupon removed");
    };

    const handleCheckout = () => {
        if (isAuthenticated || isAdminAuthenticated) {
            navigate("/checkout");
        } else {
            // Redirect to login but save the intent to come back to checkout
            navigate("/auth/login?redirect=/checkout");
        }
    };

    // Filter out invalid items (where product might be null due to deletion or old data)
    const validItems = items.filter(item => item && item.product);

    if (loading && validItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    if (validItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="bg-gray-50 rounded-[3rem] p-12 inline-block mb-8">
                    <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Looks like you haven't added anything to your cart yet.
                    Explore our amazing products and find something you love!
                </p>
                <Button onClick={() => navigate("/shop")} className="px-8 py-4 text-lg">
                    Start Shopping
                </Button>
            </div>
        );
    }

    const discountAmount = appliedCoupon ? (total * (appliedCoupon.discountPercent / 100)) : 0;
    const finalTotal = Math.max(0, total - discountAmount);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {validItems.map((item) => {
                        const productId = item.product.id || item.product._id;
                        const productPrice = item.product.price || 0;
                        const productImage = item.product.images?.[0] || "/placeholder-product.png";

                        return (
                            <div
                                key={productId}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center"
                            >
                                {/* Product Image */}
                                <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={productImage}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.product.name}</h3>
                                    <p className="text-indigo-600 font-black text-lg mb-4">
                                        ₹{productPrice.toFixed(2)}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100">
                                            <button
                                                onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                                className="p-2 hover:text-indigo-600 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                                className="p-2 hover:text-indigo-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(productId)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Item Total */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-black text-gray-900">
                                        ₹{(productPrice * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-between items-center pt-4">
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="text-red-500 hover:bg-red-50 border-red-100"
                        >
                            Clear Cart
                        </Button>
                        <Link to="/shop" className="text-indigo-600 font-bold hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 sticky top-24">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
                            </div>

                            {/* Applied Coupon Display */}
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        <span className="font-bold uppercase tracking-wider text-xs">{appliedCoupon.code}</span>
                                        <span className="text-xs">(-{appliedCoupon.discountPercent}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                                        <button onClick={handleRemoveCoupon} className="p-1 hover:bg-green-200 rounded-full transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold font-mono">FREE</span>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-indigo-600">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Input Area */}
                        {!appliedCoupon && (
                            <div className="mb-8 flex gap-3">
                                <div className="flex-1">
                                    <input
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm uppercase font-bold tracking-wider outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                                    />
                                </div>
                                <Button
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponCode.trim()}
                                    className="py-2.5 px-6 whitespace-nowrap rounded-xl text-sm"
                                >
                                    {validatingCoupon ? <Loader2 className="w-5 h-5 animate-spin" /> : "Apply"}
                                </Button>
                            </div>
                        )}

                        <Button
                            onClick={handleCheckout}
                            className="w-full py-4 text-lg flex items-center justify-center gap-2 group"
                        >
                            Checkout
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Tax included. Shipping calculated at checkout.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-gray-600">
                                Safe and secure payment gateway
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
