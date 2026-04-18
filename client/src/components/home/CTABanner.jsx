import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTABanner = () => {
    const navigate = useNavigate();
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-indigo-600 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl shadow-indigo-200">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-24 -mb-24 blur-2xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-sm mb-8">
                            <Gift className="w-5 h-5 text-white animate-pulse" />
                            <span>Exclusive Early Access</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight  tracking-tight">
                            Start Your Shopping <br />
                            Experience Today
                        </h2>

                        <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl mb-12">
                            Join over 50,000 satisfied customers and get access to exclusive deals, 
                            faster shipping, and 24/7 support.
                        </p>

                        <button className="px-10 py-5 bg-white text-indigo-600 font-extrabold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl" onClick={() => navigate("/auth/register")}>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
