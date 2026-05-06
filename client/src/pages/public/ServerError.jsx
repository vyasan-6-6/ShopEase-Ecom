 
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

const ServerError = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center animate-in fade-in zoom-in duration-700">
                {/* Visual Element */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <AlertCircle className="w-24 h-24 text-red-500 animate-pulse" />
                        <div className="absolute -bottom-2 w-24 h-4 bg-gray-200 rounded-[100%] blur-md"></div>
                    </div>
                </div>

                <p className="text-base font-black text-red-600 uppercase tracking-widest">500 Error</p>
                <h1 className="mt-4 text-5xl font-black tracking-tight text-gray-900 sm:text-7xl">
                    Something went wrong
                </h1>
                <p className="mt-6 text-lg leading-7 text-gray-600 max-w-lg mx-auto font-medium">
                    Our servers are having some trouble right now. We're working hard to get things back to normal. Please try again in a few minutes.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all flex items-center gap-2 group active:scale-95"
                    >
                        <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                        Try Refreshing
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-2xl px-6 py-3.5 text-sm font-black text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
