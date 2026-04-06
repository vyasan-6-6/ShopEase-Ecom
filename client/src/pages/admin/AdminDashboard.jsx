import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../redux/features/admin/adminSlice";
import { useAppDispatch } from "../../redux/hooks";
import { AUTH_CONFIG } from "../../config/app";
// import { selectAdminUser } from "../../redux/features/admin/adminSelector";

const AdminDashboard = () => { 

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const handleLogout =()=>{
        localStorage.removeItem(AUTH_CONFIG.adminKey);
        dispatch(logout());
        navigate("/admin/login",{replace:true});

    }
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* BLACK ADMIN SIDEBAR */}
            <div className="w-64 bg-black text-white flex flex-col p-6 shadow-xl">
                <h2 className="text-2xl font-bold tracking-wider mb-10 text-center">ShopEase<br/><span className="text-sm text-gray-400 font-normal">ADMIN PORTAL</span></h2>
                
                <nav className="flex flex-col gap-4 font-medium flex-1">
                    <Link to="/admin/dashboard" className="px-4 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition">📊 Overview</Link>
                    <Link to="/admin/dashboard/profile" className="px-4 py-3 rounded-xl hover:bg-gray-800 transition">👤 My Profile</Link>
                    <Link to="/admin/dashboard/users" className="px-4 py-3 rounded-xl hover:bg-gray-800 transition">👥 Manage Users</Link>
                    <Link to="/admin/dashboard/products" className="px-4 py-3 rounded-xl hover:bg-gray-800 transition">📦 Products</Link>
                </nav>
                

               <div  className="mt-auto pt-6 border-t border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 bg-red-950/30 rounded-xl hover:bg-red-900/50 hover:text-red-300 transition font-bold">
                      🚪 Log Out
                </button>
               </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 p-10 overflow-y-auto">
                 {/* The <Outlet/> is the magic frame! When clicking "My Profile" above, 
                     the AdminProfile component paints itself exactly right here! */}
                 <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
