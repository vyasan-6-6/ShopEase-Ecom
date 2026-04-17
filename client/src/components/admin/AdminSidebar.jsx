import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { tokenService } from "../../utils/apiClient";
import { useAppDispatch } from "../../redux/hooks";
import { AUTH_CONFIG } from "../../config/app";
import { memo } from "react";
import clsx from "clsx";

const AdminSidebar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        tokenService.clearAll();
        dispatch(logout());
        navigate("/admin/login", { replace: true });
    };

    const linkClasses = ({ isActive }) =>
        clsx(
            "px-4 py-3 rounded-xl transition font-medium",
            isActive ? "bg-gray-800 text-white shadow-inner" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
        );
    return (
        <div className="w-64 bg-black text-white flex flex-col p-6 shadow-xl h-screen  sticky top-0">
            <h2 className="text-2xl font-bold tracking-wider mb-10 text-center">
                ShopEase
                <br />
                <span className="text-sm text-gray-400 font-normal">ADMIN PORTAL</span>
            </h2>

            <nav className="flex flex-col gap-2 flex-1">
                <NavLink to="/admin/dashboard" end className={linkClasses}>
                    📊 Overview
                </NavLink>
                <NavLink to="/admin/dashboard/profile" className={linkClasses}>
                    👤 My Profile
                </NavLink>
                <NavLink to="/admin/dashboard/users" className={linkClasses}>
                    👥 Manage Users
                </NavLink>
                <NavLink to="/admin/dashboard/products" className={linkClasses}>
                    📦 Products
                </NavLink>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 bg-red-950/30 rounded-xl hover:bg-red-900/50 hover:text-red-300 transition font-bold"
                >
                    🚪 Log Out
                </button>
            </div>
        </div>
    );
};

export default memo(AdminSidebar);
