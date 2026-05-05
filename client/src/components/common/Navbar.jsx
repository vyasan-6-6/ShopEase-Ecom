import { memo, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Settings, ChevronDown, Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectUser, selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { selectAdmin, selectIsAdminAuthenticated } from "../../redux/features/auth/adminAuthSelectors";
import { selectCartTotalCount } from "../../redux/features/cart/cartSelectors";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectActiveCategories } from "../../redux/features/category/categorySelectors";
import { logout } from "../../redux/features/auth/authSlice";
import { adminLogout } from "../../redux/features/auth/adminAuthSlice";
import { tokenService } from "../../utils/apiClient";
import { useDebounce } from "../../hooks/useDebounce";
import clsx from "clsx";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);//mobile nav
    const [isProfileOpen, setIsProfileOpen] = useState(false);//profile dropdown
    const [isCatOpen, setIsCatOpen] = useState(false);
    
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);
    const admin = useAppSelector(selectAdmin);
    
    const cartCount = useAppSelector(selectCartTotalCount);
    const categories = useAppSelector(selectActiveCategories);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const profileRef = useRef(null);
    const catRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState(() => {
        return new URLSearchParams(window.location.search).get("search") || "";
    });
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Sync input with URL search param
    useEffect(() => {
        const searchParam = new URLSearchParams(location.search).get("search");
        setSearchTerm(searchParam || "");
    }, [location.search]);

    // Live debounced search when on Shop page
    useEffect(() => {
        if (location.pathname === "/shop") {
            const currentSearch = new URLSearchParams(location.search).get("search") || "";
            const trimmedSearch = debouncedSearch.trim();
            
            if (trimmedSearch !== currentSearch) {
                setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    if (trimmedSearch) {
                        params.set("search", trimmedSearch);
                    } else {
                        params.delete("search");
                    }
                    params.set("page", "1");
                    return params;
                });
            }
        }
    }, [debouncedSearch, location.pathname, setSearchParams]);

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
        dispatch(adminLogout());
        navigate("/");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?page=1&search=${(searchTerm.trim())}`); 
            setIsOpen(false);
        }
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
                    
                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-10">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-transparent rounded-2xl py-2.5 pl-12 pr-10 text-sm focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-400 font-medium"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </form>
                    </div>

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
                        {(isAuthenticated || isAdminAuthenticated) ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                                        {(user?.avatar || admin?.avatar) ? (
                                            <img src={user?.avatar || admin?.avatar} alt={user?.name || admin?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5 whitespace-nowrap">
                                        {(user?.name || admin?.name)?.split(" ")[0]}
                                        {isAdminAuthenticated && (
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
                                            <p className="text-sm font-black text-gray-900">{user?.name || admin?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || admin?.email}</p>
                                        </div>
                                        
                                        {isAdminAuthenticated && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Admin Panel
                                            </Link>
                                        )}

                                        {isAuthenticated && (
                                            <Link
                                                to="/user/dashboard"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                My Account
                                            </Link>
                                        )}
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="w-[calc(100%-1rem)] mx-2 flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all mt-2 mb-1"
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
                    {/* Mobile Search */}
                    <div className="pb-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-transparent rounded-xl py-3 pl-12 pr-10 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600/10 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </form>
                    </div>

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

                    {isAuthenticated ? (
                        <div className="pt-6 mt-6 border-t border-gray-50 space-y-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <Link
                                    to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    {user?.role === "admin" ? "Admin Panel" : "My Account"}
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-base font-black text-white bg-red-600 rounded-2xl shadow-lg shadow-red-100 active:scale-95 transition-all mt-4"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
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