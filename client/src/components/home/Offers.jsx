import { memo, useEffect } from "react";
import { Tag, Sparkles, Gift , Copy } from "lucide-react";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectAllCoupons, selectCouponLoading } from "../../redux/features/coupon/couponSelectors";
import { fetchCoupons } from "../../redux/features/coupon/couponSlice";

const colors = [
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-emerald-400 to-teal-500",
    "bg-gradient-to-br from-orange-400 to-rose-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-pink-500 to-rose-400"
];

const getIcon = (index) => {
    switch (index % 3) {
        case 0: return <Sparkles className="w-6 h-6 text-white" />;
        case 1: return <Gift className="w-6 h-6 text-white" />;
        case 2: return <Tag className="w-6 h-6 text-white" />;
        default: return <Sparkles className="w-6 h-6 text-white" />;
    }
};

const Offers = () => {
    const dispatch = useAppDispatch();
    const allCoupons = useAppSelector(selectAllCoupons);
    const loading = useAppSelector(selectCouponLoading);

    // Filter active coupons and take top 3
    const activeCoupons = allCoupons?.filter(c => c.isActive !== false) || [];
    const displayCoupons = activeCoupons.slice(0, 3);
    

    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon ${code} copied to clipboard!`, { icon: "✂️" });
    };

    if (loading && displayCoupons.length === 0) {
        return (
            <section className="py-20 bg-gray-50 flex justify-center items-center">
                <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
            </section>
        );
    }

    if (displayCoupons.length === 0) {
        return null; // Don't show offers section if no active coupons exist
    }

    return (
        <section className="py-20 bg-gray-50 overflow-hidden relative">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
                        Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Offers</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        Grab these limited-time deals and instantly save on your favorite items.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayCoupons.map((coupon, index) => {
                        const colorClass = colors[index % colors.length];
                        const icon = getIcon(index);
                        const minOrderText = coupon.minOrderAmount > 0 ? ` on orders above $${coupon.minOrderAmount}` : "";
                        const expiryText = coupon.expiryDate && new Date(coupon.expiryDate) > new Date() ? `Expires ${new Date(coupon.expiryDate).toLocaleDateString()}` : "Limited time only";

                        return (
                            <div
                                key={coupon.id || coupon._id}
                                className="relative group bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
                            > 
                                {/* Top Color Banner */}
                                <div className={`${colorClass} h-24 p-6 flex items-center justify-between`}>
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                        {icon}
                                    </div>
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{coupon.discountPercent}% OFF</h3>
                                        <p className="text-gray-600 font-medium mb-6">Enjoy {coupon.discountPercent}% off{minOrderText}!</p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between p-1 pl-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl group-hover:border-indigo-400 transition-colors">
                                            <span className="font-mono font-black text-lg text-gray-900 tracking-wider">
                                                {coupon.code}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(coupon.code)}
                                                className="p-2 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg shadow-sm transition-colors border border-gray-100 flex items-center gap-2"
                                                title="Copy Code"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-center text-gray-400 mt-3 font-semibold uppercase tracking-wider">{expiryText}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default memo(Offers);
