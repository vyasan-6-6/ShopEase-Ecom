import { useState, useEffect } from "react";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import adminApi from "../../services/AdminService";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isToggling, setIsToggling] = useState(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getAllUsers(searchTerm);
            if (res.success) {
                setUsers(res.data.users || []);
            }
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleToggleBan = async (userId, currentStatus) => {
        const action = currentStatus === "banned" ? "Unban" : "Ban";
        
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to ${action.toLowerCase()} this user?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: currentStatus === "banned" ? "#10b981" : "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${action} them!`
        });

        if (!result.isConfirmed) return;

        setIsToggling(userId);
        try {
            const res = await adminApi.toggleUserBan(userId);
            if (res.success) {
                toast.success(res.message);
                setUsers(users.map(u => u.id === userId ? { ...u, status: res.data.user.status } : u));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update user status");
        } finally {
            setIsToggling(null);
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading Users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Users</h1>
                    <p className="text-gray-500 mt-1 font-medium">View and manage customer accounts and statuses.</p>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                    />
                </div>
                <div className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                    Total Users: {users.length}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold">Joined</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{user.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-gray-600 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.status === 'banned' ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleToggleBan(user.id, user.status)}
                                            disabled={isToggling === user.id || user.role === 'admin'}
                                            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                                user.role === 'admin' 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : user.status === 'banned'
                                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                            }`}
                                        >
                                            {isToggling === user.id ? (
                                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : user.status === 'banned' ? (
                                                <><ShieldCheck className="w-4 h-4" /> Unban</>
                                            ) : (
                                                <><ShieldAlert className="w-4 h-4" /> Ban</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
