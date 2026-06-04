import { ArrowRight, ShoppingBag, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:pt-16 md:pb-24 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-3xl -ml-24 -mb-24" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 font-bold text-sm">
                        <Zap className="w-4 h-4 fill-indigo-600" />
                        <span>Limited Time: Free Shipping on all orders over ₹99</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                        Shop Smart, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                            Live Better.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                        Discover the finest collection of products curated just for you. Quality, 
                        style, and elegance—all in one place at ShopEase.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link
                            to="/shop"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 hover:-translate-y-1 active:scale-95"
                        >
                            Shop Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/shop"
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                        >
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            Browse Collections
                        </Link>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">50K+</p>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Happy Customers</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">12K+</p>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Premium Products</p>
                        </div>
                    </div>
                </div>

                {/* Hero Illustration/Image */}
                <div className="flex-1 relative">
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-200 rotate-2 hover:rotate-0 transition-transform duration-700">
                        <img
                            src="/hero_lifestyle_ecommerce_1775671700510.png"
                            alt="Premium Lifestyle Gadgets"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    {/* Glassmorphic accent card */}
                    <div className="absolute -bottom-8 -left-8 z-20 p-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl hidden md:block animate-bounce-subtle">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                                <Zap className="w-6 h-6 fill-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Arrival</p>
                                <p className="text-lg font-black text-gray-900">Noise-Cancelling Max</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
