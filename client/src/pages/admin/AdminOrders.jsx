import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAllOrders, updateOrderStatus } from "../../redux/features/order/adminOrderSlice";
import Swal from "sweetalert2";
import { Package, Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

const AdminOrders = () => {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state) => state.adminOrder);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const params = {};
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (statusFilter !== "All") params.status = statusFilter;
        
        // Skip fetching if default view and we already have orders
        if (Object.keys(params).length === 0 && orders && orders.length > 0) {
            return;
        }

        dispatch(fetchAllOrders(params));
    }, [dispatch, debouncedSearchTerm, statusFilter, orders?.length]);

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const result = await Swal.fire({
            title: 'Change Order Status?',
            text: `Are you sure you want to change the status to ${newStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        });

        if (!result.isConfirmed) return;

        try {
            await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
            Swal.fire({
                title: 'Updated!',
                text: 'Order status has been updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error || "Failed to update status",
                icon: 'error',
                confirmButtonColor: '#4f46e5'
            });
        }
    };

    const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Package className="w-8 h-8 text-indigo-600" />
                    Manage Orders
                </h1>
                <p className="text-gray-500 mt-2">View and update customer orders across the platform.</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Order ID or User (Name/Email)..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                        />
                    </div>
                    
                    <div className="md:w-48">
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : orders?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                </div>                                                                                          
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders?.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order._id.substring(order._id.length - 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.user ? order.user.name : "Deleted User"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.user ? order.user.email : ""}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                  order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                  order.orderStatus === 'Returned' ? 'bg-orange-100 text-orange-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 p-1"
                                                disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned' || order.orderStatus === 'Delivered'}
                                            >   
                                                {statusOptions.map(s => (
                                                    <option key={s} value={s}>
                                                        Mark {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
