import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCartItems, selectCartTotal, selectCartLoading } from "../../redux/features/cart/cartSelectors";
import { selectValidatedCoupon } from "../../redux/features/coupon/couponSelectors";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { createOrder, verifyPayment } from "../../redux/features/order/orderSlice";
import { selectOrderLoading } from "../../redux/features/order/orderSelectors";
import { clearUserCart } from "../../redux/features/cart/cartSlice";
import { clearValidatedCoupon } from "../../redux/features/coupon/couponSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import { Loader2, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react";

import { checkoutSchema } from "../../utils/checkoutSchema";

 
const loadRazorpayScript = () => {
    return new Promise((resolve) => {//promise is used because , loading script takes time, it waits for it to finish.
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const user = useAppSelector(selectUser);
    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    const cartLoading = useAppSelector(selectCartLoading);
    const orderLoading = useAppSelector(selectOrderLoading);
    const appliedCoupon = useAppSelector(selectValidatedCoupon);
    
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            phone: ""
        }
    });

    const discountAmount = appliedCoupon ? (total * (appliedCoupon.discountPercent / 100)) : 0;
    const finalTotal = Math.max(0, total - discountAmount);//prevent final price from going below 0

    useEffect(() => {
        if (user?.addresses?.length > 0) {
            let defaultIndex = user.addresses.findIndex(a => a.isDefault);
            if (defaultIndex === -1) defaultIndex = 0;
            
            const defaultAddress = user.addresses[defaultIndex];
            if (defaultAddress) {
                setSelectedAddressIndex(defaultIndex);
                setValue("street", defaultAddress.street);
                setValue("city", defaultAddress.city);
                setValue("state", defaultAddress.state);
                setValue("zipCode", defaultAddress.zipCode);
                setValue("country", defaultAddress.country);
            }
        }
        if (user?.phone) {
            setValue("phone", user.phone);
        }
    }, [user, setValue]);

    const handleSelectAddress = (addr, index) => {
        setSelectedAddressIndex(index);
        setValue("street", addr.street);
        setValue("city", addr.city);
        setValue("state", addr.state);
        setValue("zipCode", addr.zipCode);
        setValue("country", addr.country);
    };

    useEffect(() => {
        if (!cartLoading && items.length === 0) {
            toast.info("Your cart is empty. Redirecting to shop.");
            navigate("/shop");
        }
    }, [items, cartLoading, navigate]);


 
    const handlePaymentSuccess = async (response) => {
        try {
            const verifyRes = await dispatch(verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
            })).unwrap();//removes Redux action wrapper and gives actual success/error directly.
            console.log("verifyRes",verifyRes);
            // Clean up Redux state after successful online payment
            dispatch(clearValidatedCoupon());
            dispatch(clearUserCart());
            toast.success("Payment successful! Order placed.");
            navigate(`/order-confirmation/${verifyRes.order._id}`); // redirect to confirmation page
        } catch (error) {
            toast.error(error || "Payment verification failed.");
        }
    };

    const processCheckout = async (data) => {
        
        if (items.length === 0) return;

        try {
            const orderData = {
                shippingAddress: data,
                paymentMethod,
                couponCode: appliedCoupon ? appliedCoupon.code : null
            };

            const response = await dispatch(createOrder(orderData)).unwrap();
            if (paymentMethod === "COD") {
                dispatch(clearValidatedCoupon());
                dispatch(clearUserCart());
                toast.success("Order placed successfully via Cash on Delivery!");
                navigate(`/order-confirmation/${response.order._id}`); // redirect to confirmation page
                return;
            }

            if (paymentMethod === "RAZORPAY") {
                const res = await loadRazorpayScript();
                if (!res) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    return;
                }

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure you expose this in frontend .env
                    amount: response.amount,
                    currency: response.currency,
                    name: "ShopEase",
                    description: "Order Payment",
                    order_id: response.razorpayOrderId,
                    handler: handlePaymentSuccess,
                    prefill: {
                        name: user?.name || "Customer",
                        email: user?.email || "",
                        contact: data.phone
                    },
                    theme: {
                        color: "#4f46e5"
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                
                paymentObject.on("payment.failed", function (response) {
                    toast.error("Payment failed. Please try again.");
                });
            }
        } catch (error) {
            toast.error(error || "Failed to place order.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column - Form & Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Shipping Details
                        </h2>
                        
                        {user?.addresses?.length > 0 && (
                            <div className="mb-8 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <label className="text-sm font-bold text-gray-700 mb-4 block">Quick Select Address</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.addresses.map((addr, idx) => {
                                        const isSelected = selectedAddressIndex === idx;
                                        return (
                                            <div 
                                                key={idx}
                                                onClick={() => handleSelectAddress(addr, idx)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? 'border-indigo-600 bg-indigo-50/30 shadow-md' 
                                                        : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-md'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900 capitalize flex items-center gap-2">
                                                        {addr.label}
                                                        {addr.isDefault && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Default</span>}
                                                    </span>
                                                    {isSelected && (
                                                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-1">{addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 mb-2 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or enter manually</span>
                                </div>
                            </div>
                        )}

                        <form id="checkoutForm" onSubmit={handleSubmit(processCheckout)} className="space-y-5">
                            <Input
                                label="Street Address"
                                {...register("street")}
                                error={errors.street?.message}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="City"
                                    {...register("city")}
                                    error={errors.city?.message}
                                />
                                <Input
                                    label="State/Province"
                                    {...register("state")}
                                    error={errors.state?.message}
                                />
                                <Input
                                    label="Zip/Postal Code"
                                    {...register("zipCode")}
                                    error={errors.zipCode?.message}
                                />
                                <Input
                                    label="Country"
                                    {...register("country")}
                                    error={errors.country?.message}
                                />
                            </div>
                            <Input
                                label="Phone Number"
                                type="tel"
                                {...register("phone")}
                                error={errors.phone?.message}
                            />
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Payment Method
                        </h2>
                        <div className="space-y-4">
                            {/* COD Option */}
                            <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'COD' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                                        <p className="text-sm text-gray-500">Pay when your order arrives</p>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                                />
                            </label>

                            {/* Razorpay Option */}
                            <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'RAZORPAY' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Pay Online Securely</h3>
                                        <p className="text-sm text-gray-500">Credit Card, UPI, NetBanking</p>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="RAZORPAY"
                                    checked={paymentMethod === 'RAZORPAY'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 sticky top-24">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {items.map(item => {
                                if(!item.product) return null;
                                return (
                                    <div key={item.product._id || item.product.id} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                            </div>
                            
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold font-mono">FREE</span>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-indigo-600">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            form="checkoutForm" 
                            disabled={orderLoading || items.length === 0} 
                            className="w-full py-4 text-lg"
                        >
                            {orderLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `Place Order • $${finalTotal.toFixed(2)}`}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-medium">Secured by Razorpay</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
