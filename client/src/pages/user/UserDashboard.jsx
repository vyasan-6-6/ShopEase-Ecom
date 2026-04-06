import { Link, Outlet, useNavigate } from "react-router-dom"; 
import { useAppDispatch } from "../../redux/hooks";
import { AUTH_CONFIG } from "../../config/app";
import { logout } from "../../redux/features/auth/authSlice"; 

const UserDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout =()=>{
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        dispatch(logout());
        navigate("/auth/login");
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* LIGHT CUSTOMER SIDEBAR */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-10">My Account</h2>
                
                <nav className="flex flex-col gap-2 font-medium flex-1 text-gray-600">
                    <Link to="/user/dashboard" className="px-4 py-3 text-black bg-gray-100 rounded-xl transition">📦 Recent Orders</Link>
                    <Link to="/user/dashboard/profile" className="px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-black transition">👤 Account Details</Link>
                    <Link to="/user/dashboard/addresses" className="px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-black transition">📍 Address Book</Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:text-red-700 transition font-bold">
                      🚪 Log Out
                </button>
               </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 p-10">
                 {/* The Profile or Address Book injects right here */}
                 <Outlet />
            </div>
        </div>
    );
};

export default UserDashboard;
