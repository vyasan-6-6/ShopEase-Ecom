import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { memo } from "react";

const AdminDashboard = () => {
    
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar/>
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 p-10 overflow-y-auto">
                {/* The <Outlet/> is the magic frame! When clicking "My Profile" above, 
                     the AdminProfile component paints itself exactly right here! */}
                <Outlet />
            </div>
        </div>
    );
};

export default memo(AdminDashboard);
