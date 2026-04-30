import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { memo, useState } from "react";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
        <div className="flex bg-gray-50 h-screen w-full overflow-hidden">
            {/* Mobile Header - Visible only on small screens */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-40">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                    <Menu className="w-6 h-6" /> 
                </button>
                <span className="ml-4 font-black text-gray-900 tracking-tight">Admin Dashboard</span>
            </div>

            {/* Sidebar with Drawer Logic */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50  ">
                <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10 w-full max-w-[100vw] lg:max-w-none">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default memo(AdminDashboard);
