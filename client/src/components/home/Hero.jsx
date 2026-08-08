import { ArrowRight, ShoppingBag, Zap, Star, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 to-purple-200/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-0 left-10 -z-10 w-[400px] h-[400px] bg-gradient-to-tr from-sky-200/40 to-indigo-100/30 rounded-full blur-[90px] -ml-24 -mb-24" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                    {/* Premium Tagline Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50/80 backdrop-blur-md border border-indigo-100/50 rounded-full text-indigo-700 font-extrabold text-xs tracking-wider uppercase shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                        <span>Discover the Future of Retail</span>
                    </div>

                    {/* Captivating Headline */}
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight">
                        Shop Smart. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600">
                            Live Smarter.
                        </span>
                    </h1>

                    {/* Elegant Description */}
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                        Curating the finest selection of ultra-modern tech, premium lifestyle essentials, 
                        and everyday luxuries. Crafted for quality, chosen for elegance.
                    </p>

                    {/* Call to Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                        <Link
                            to="/shop"
                            className="w-full sm:w-auto px-8 py-5 bg-gray-950 text-white rounded-2xl font-bold flex items-center justify-center gap-3.5 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95 duration-300"
                        >
                            Shop Collections
                            <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/shop"
                            className="w-full sm:w-auto px-8 py-5 bg-white border border-gray-200 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 duration-300"
                        >
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            Explore Shop
                        </Link>
                    </div>

                    {/* Quick Category Quicklinks */}
                    <div className="pt-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Popular Categories</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                            {["Electronics", "Fashion", "Home & Kitchen", "Beauty & Health"].map((cat) => (
                                <Link
                                    key={cat}
                                    to="/shop"
                                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 rounded-xl text-xs font-bold text-gray-650 hover:text-indigo-700 transition-all shadow-sm"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 border-t border-gray-105 max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900">4.9 / 5.0</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Rated Store</p>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-black text-gray-900">100% Secure</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Buyer Protection</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Illustration/Image */}
                <div className="flex-grow lg:flex-1 relative flex justify-center lg:justify-end w-full">
                    {/* Main Banner Container */}
                    <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100 border-4 border-white transform hover:scale-[1.02] transition-all duration-700 ease-out group">
                        <img
                            src="/hero_lifestyle_premium.png"
                            alt="ShopEase Premium Collections"
                            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Floating Accent Card 1 (Bottom Left) */}
                    <div className="absolute -bottom-6 -left-4 z-20 p-5 bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl hidden sm:flex items-center gap-4 animate-bounce-subtle">
                        <div className="p-3.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Zap className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Fast Shipping</p>
                            <p className="text-base font-black text-gray-900">Same-Day Delivery</p>
                        </div>
                    </div>

                    {/* Floating Accent Card 2 (Top Right) */}
                    <div className="absolute -top-6 -right-4 z-20 px-5 py-3 bg-white/85 backdrop-blur-xl border border-white/65 rounded-2xl shadow-lg hidden sm:flex items-center gap-2 animate-bounce-subtle delay-500">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full absolute" />
                        <span className="text-xs font-extrabold text-gray-800 tracking-wide">12K+ Products Online</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
