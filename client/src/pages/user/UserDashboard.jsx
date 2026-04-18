import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { AUTH_CONFIG } from "../../config/app";
import { logout } from "../../redux/features/auth/authSlice";
import { Package, User, MapPin, LogOut, ChevronRight } from "lucide-react";
import clsx from "clsx";

const UserDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        dispatch(logout());
        navigate("/auth/login");
    }

    const navLinks = [
        { icon: User, name: "User Dashboard", path: "/user/dashboard" },
        { icon: MapPin, name: "Address Book", path: "/user/dashboard/addresses" },
    ];

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* SIDEBAR - Desktop */}
                    <aside className="hidden lg:flex w-72 flex-col gap-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-fit sticky top-28">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 px-2 tracking-tight">My Account</h2>
                            
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={clsx(
                                                "group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
                                                isActive 
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1" 
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <link.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600")} />
                                                {link.name}
                                            </div>
                                            <ChevronRight className={clsx("w-4 h-4 transition-transform", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center gap-3 px-5 py-4 text-red-500 bg-red-50/50 rounded-2xl hover:bg-red-50 transition-all font-bold text-sm group"
                                >
                                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MOBILE NAVIGATION - Horizontal Scroll */}
                    <nav className="lg:hidden flex overflow-scroll no-scrollbar gap-3 pb-2 sticky top-20 z-30 bg-gray-50/50 backdrop-blur-md py-4">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;//usecase of this line is to check if the current path is equal to the link path and if it is then it will apply the active styles
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={clsx(
                                        "flex-none flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shadow-sm",
                                        isActive 
                                            ? "bg-white text-indigo-600 border border-indigo-100 shadow-indigo-50" 
                                            : "bg-white/50 text-gray-500 border border-transparent hover:bg-white"
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <button 
                            onClick={handleLogout}
                            className="flex-none flex items-center gap-2 px-6 py-3.5 bg-red-50 text-red-500 rounded-2xl font-bold text-sm whitespace-nowrap border border-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </nav>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
