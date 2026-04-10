import { memo } from "react";
import { Tag, Sparkles, Gift, SearchCheck, Copy } from "lucide-react";
import { toast } from "react-toastify";

const offers = [
    {
        id: 1,
        title: "Welcome Bonus",
        description: "Get 20% off your very first purchase with us.",
        code: "WELCOME20",
        color: "bg-gradient-to-br from-indigo-500 to-purple-600",
        icon: <Sparkles className="w-6 h-6 text-white" />,
        validity: "Valid for new users only",
    },
    {
        id: 2,
        title: "Free Shipping",
        description: "Enjoy free delivery on all orders above $50.",
        code: "FREESHIP",
        color: "bg-gradient-to-br from-emerald-400 to-teal-500",
        icon: <Gift className="w-6 h-6 text-white" />,
        validity: "Applies at checkout",
    },
    {
        id: 3,
        title: "Flash Sale",
        description: "Extra 15% off on all electronics & gadgets.",
        code: "FLASH15",
        color: "bg-gradient-to-br from-orange-400 to-rose-500",
        icon: <Tag className="w-6 h-6 text-white" />,
        validity: "Ends in 24 hours",
    },
];

const Offers = () => {

    // Copy the coupon code to the user's clipboard and notify them!
    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon ${code} copied to clipboard!`, { icon: "✂️" });
    };

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
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="relative group bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
                        >
                            {/* Top Color Banner */}
                            <div className={`${offer.color} h-24 p-6 flex items-center justify-between`}>
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                    {offer.icon}
                                </div>
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                                    <p className="text-gray-600 font-medium mb-6">{offer.description}</p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between p-1 pl-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl group-hover:border-indigo-400 transition-colors">
                                        <span className="font-mono font-black text-lg text-gray-900 tracking-wider">
                                            {offer.code}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(offer.code)}
                                            className="p-2 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg shadow-sm transition-colors border border-gray-100 flex items-center gap-2"
                                            title="Copy Code"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-3 font-semibold uppercase tracking-wider">{offer.validity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(Offers);
