import { Link } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { memo } from "react";

const AdminQuickBar = () => {
    const user = useAppSelector(selectUser);

    if (user?.role !== "admin") return null;

    return (
        <div className="bg-gray-900 text-white py-2 px-4 shadow-sm relative z-[60] border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Admin Mode
                    </div>
                    <Link 
                        to="/admin/dashboard" 
                        className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                    >
                        <LayoutDashboard className="w-3 h-3" />
                        Dashboard
                    </Link>
                    <Link 
                        to="/admin/dashboard/products" 
                        className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors hidden sm:flex"
                    >
                        <PlusCircle className="w-3 h-3" />
                        Add Product
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                     <span className="text-gray-500 hidden md:inline">Logged in as {user.name}</span>
                     <Link 
                        to="/admin/dashboard/profile" 
                        className="p-1 hover:text-indigo-400 transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default memo(AdminQuickBar);
