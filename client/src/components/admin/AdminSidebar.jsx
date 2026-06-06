import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { adminLogout } from "../../redux/features/auth/adminAuthSlice";
import { tokenService } from "../../utils/apiClient";
import { useAppDispatch } from "../../redux/hooks";
import { memo } from "react";
import { 
    X, 
    House, 
    LayoutDashboard, 
    UserCircle, 
    Tags, 
    Users, 
    Package, 
    Truck, 
    Ticket, 
    TrendingUp, 
    Image, 
    LogOut 
} from "lucide-react";
import clsx from "clsx";

const AdminSidebar = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        tokenService.clearAll();
        dispatch(logout());
        dispatch(adminLogout());
        navigate("/admin/login", { replace: true });
    };

    const linkClasses = ({ isActive }) =>
        clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm",
            isActive ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 translate-x-1" : "text-gray-400 hover:bg-gray-800 hover:text-white"
        );
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Main Sidebar */}
            <div className={clsx(
                "w-64 bg-black text-white flex flex-col p-6 shadow-2xl h-screen fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:translate-x-0 border-r border-gray-800",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black tracking-tight text-white">
                        Shop<span className="text-brand-400">Ease</span>
                        <br />
                        <span className="text-[10px] bg-brand-900/50 text-brand-200 px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-1 inline-block">ADMIN PORTAL</span>
                    </h2>
                    {/* Close button - Mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 flex-1 pt-4">
                    <NavLink to="/admin/dashboard" end className={linkClasses} onClick={onClose}>
                        <LayoutDashboard className="w-5 h-5" /> Overview
                    </NavLink>
                    <NavLink to="/admin/dashboard/profile" className={linkClasses} onClick={onClose}>
                        <UserCircle className="w-5 h-5" /> Admin Profile
                    </NavLink>
                    <NavLink to="/admin/dashboard/categories" className={linkClasses} onClick={onClose}>
                        <Tags className="w-5 h-5" /> Categories
                    </NavLink>
                    <NavLink to="/admin/dashboard/users" className={linkClasses} onClick={onClose}>
                        <Users className="w-5 h-5" /> Manage Users
                    </NavLink>
                    <NavLink to="/admin/dashboard/products" className={linkClasses} onClick={onClose}>
                        <Package className="w-5 h-5" /> Products
                    </NavLink>
                    <NavLink to="/admin/dashboard/orders" className={linkClasses} onClick={onClose}>
                        <Truck className="w-5 h-5" /> Orders
                    </NavLink>
                    <NavLink to="/admin/dashboard/coupons" className={linkClasses} onClick={onClose}>
                        <Ticket className="w-5 h-5" /> Coupons
                    </NavLink>
                    <NavLink to="/admin/dashboard/reports" className={linkClasses} onClick={onClose}>
                        <TrendingUp className="w-5 h-5" /> Reports
                    </NavLink>
                    <NavLink to="/admin/dashboard/banners" className={linkClasses} onClick={onClose}>
                        <Image className="w-5 h-5" /> Banners
                    </NavLink>

                    {/* Return to Storefront */}
                    <div className="my-4 border-t border-gray-800/50" />
                    <NavLink to="/shop" className={linkClasses} onClick={onClose}>
                        <House className="w-5 h-5" /> View Store
                    </NavLink>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-900">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 bg-red-950/20 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default memo(AdminSidebar);
