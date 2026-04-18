import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center animate-in fade-in zoom-in duration-700">
                {/* Visual Element */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <Ghost className="w-24 h-24 text-indigo-500 animate-bounce" />
                        <div className="absolute -bottom-2 w-24 h-4 bg-gray-200 rounded-[100%] blur-md"></div> {/*blur-md means blur the image by 10px*/}
                    </div>
                </div>

                <p className="text-base font-black text-indigo-600 uppercase tracking-widest">404 Error</p>
                <h1 className="mt-4 text-5xl font-black tracking-tight text-gray-900 sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-lg leading-7 text-gray-600 max-w-lg mx-auto font-medium">
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed in the first place.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-4">
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center gap-2 group active:scale-95"
                    >
                        <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}//navigate(-1) means go back to the previous page
                        className="rounded-2xl px-6 py-3.5 text-sm font-black text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                <div className="mt-16 border-t border-gray-100 pt-8">
                    <p className="text-sm font-semibold text-gray-400">
                        Need help? <a href="#" className="text-indigo-600 hover:text-indigo-500">Contact support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
