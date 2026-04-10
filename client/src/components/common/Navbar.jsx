import { memo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Settings, House } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectUser, selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { logout } from "../../redux/features/auth/authSlice";
import clsx from "clsx";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);//mobile nav
    const [isProfileOpen, setIsProfileOpen] = useState(false);//profile dropdown
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/login");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Categories", path: "/categories" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                            <ShoppingCart className="w-6 h-6 fill-white" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">
                            Shop<span className="text-indigo-600">Ease</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "text-sm font-bold transition-colors",
                                    location.pathname === link.path
                                        ? "text-indigo-600"
                                        : "text-gray-600 hover:text-indigo-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-5">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                3
                            </span>
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{user?.name?.split(" ")[0]}</span>
                                </button>

                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-black text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/user/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/user/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/auth/login"
                                    className={clsx(
                                        "text-sm font-bold px-4 py-2 rounded-xl transition-all",
                                        location.pathname === "/auth/login"
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                    )}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className={clsx(
                                        "text-sm font-bold px-6 py-2.5 rounded-xl transition-all",
                                        location.pathname === "/auth/register"
                                            ? "bg-indigo-600 text-white shadow-lg  "
                                            : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                                    )}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-gray-600">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                3
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={clsx(
                    "md:hidden absolute w-full bg-white border-b border-gray-100 overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 pt-4 pb-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "block px-4 py-3 text-base font-bold rounded-xl transition-colors",
                                location.pathname === link.path
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {!isAuthenticated && (
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                            <Link
                                to="/auth/login"
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center justify-center px-4 py-3 text-sm font-bold border rounded-xl transition-colors",
                                    location.pathname === "/auth/login"
                                        ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                Login
                            </Link>
                            <Link
                                to="/auth/register"
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition-colors",
                                    location.pathname === "/auth/register"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                        : "text-gray-600 border border-transparent hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default memo(Navbar);