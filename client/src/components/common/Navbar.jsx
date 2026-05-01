import { memo, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectUser, selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { selectCartTotalCount } from "../../redux/features/cart/cartSelectors";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectAllCategories } from "../../redux/features/category/categorySelectors";
import { logout } from "../../redux/features/auth/authSlice";
import { tokenService } from "../../utils/apiClient";
import clsx from "clsx";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);//mobile nav
    const [isProfileOpen, setIsProfileOpen] = useState(false);//profile dropdown
    const [isCatOpen, setIsCatOpen] = useState(false);
    
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const cartCount = useAppSelector(selectCartTotalCount);
    const categories = useAppSelector(selectAllCategories);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const profileRef = useRef(null);
    const catRef = useRef(null);

    // Fetch categories on mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => { 
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (catRef.current && !catRef.current.contains(event.target)) {
                setIsCatOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);//one time mount and unmount means no dependencies for closing the dropdown
 
    // Close menus whenever the URL changes (navigation)
    useEffect(() => {
        setIsProfileOpen(false);
        setIsOpen(false);
        setIsCatOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        tokenService.clearAll();
        dispatch(logout());
        navigate("/");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
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
                        
                        {/* Categories Dropdown */}
                        <div className="relative" ref={catRef}>
                            <button 
                                onClick={() => setIsCatOpen(!isCatOpen)}
                                className={clsx(
                                    "flex items-center gap-1 text-sm font-bold transition-colors",
                                    isCatOpen ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                                )}
                            >
                                Categories
                                <ChevronDown className={clsx("w-4 h-4 transition-transform", isCatOpen && "rotate-180")} />
                            </button>
                            
                            {isCatOpen && (
                                <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                to={`/shop?category=${cat.id}`}
                                                className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="px-4 py-2 text-xs text-gray-400">No categories found</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-5">
                        {/* Cart */}
                        <Link 
                            to="/cart" 
                            className={clsx(
                                "relative p-2 transition-colors",
                                location.pathname === "/cart" ? "text-indigo-600 bg-indigo-100 rounded" : "text-gray-600 hover:text-indigo-600"
                            )}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
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
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5 whitespace-nowrap">
                                        {user?.name?.split(" ")[0]}
                                        {user?.role === "admin" && (
                                            <span className="px-1.5 py-0.5 bg-indigo-600 text-[9px] text-white rounded-md uppercase tracking-wider flex-shrink-0">
                                                Admin
                                            </span>
                                        )}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-black text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                                        </Link>
                                        {user.role !== "admin" && (
                                            <Link
                                                to="/user/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                        )}
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
                        <Link 
                            to="/cart" 
                            className={clsx(
                                "relative p-2 transition-colors",
                                location.pathname === "/cart" ? "text-indigo-600" : "text-gray-600"
                            )}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
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
                    isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 pt-4 pb-6 space-y-2 overflow-y-auto max-h-[90vh]">
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
                    
                    {/* Mobile Categories */}
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/shop?category=${cat.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

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