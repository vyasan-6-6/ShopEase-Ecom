import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// import { selectUser } from "../../redux/features/auth/authSelectors";

const UserDashboard = () => {
    // const user = useSelector(selectUser);

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
