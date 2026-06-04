import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyOrders, cancelOrderThunk, returnOrderThunk } from "../../redux/features/order/orderSlice";
import Button from "../../components/common/Button";
import { Package, XCircle, RotateCcw, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { confirmAction } from "../../utils/alerts";
import { selectMyOrders, selectOrderLoading } from "../../redux/features/order/orderSelectors";

const MyOrders = () => {

    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectMyOrders);
    const loading = useAppSelector(selectOrderLoading);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleCancel = async (orderId) => {
        const isConfirmed = await confirmAction(
            "Cancel Order", 
            "Are you sure you want to cancel this order? This action cannot be undone.", 
            "Yes, cancel it"
        );
        if (!isConfirmed) return;
        
        const result = await dispatch(cancelOrderThunk(orderId));
        if (cancelOrderThunk.fulfilled.match(result)) {
            toast.success("Order cancelled successfully");
        } else {
            toast.error(result.payload || "Failed to cancel order");
        }
    };

    const handleReturn = async (orderId) => {
        const isConfirmed = await confirmAction(
            "Return Order", 
            "Are you sure you want to return this order?", 
            "Yes, return it"
        );
        if (!isConfirmed) return;

        const result = await dispatch(returnOrderThunk(orderId));
        if (returnOrderThunk.fulfilled.match(result)) {
            toast.success("Order return requested successfully");
        } else {
            toast.error(result.payload || "Failed to return order");
        }
    };

    if (loading && (!orders || orders.length === 0)) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase yet.</p>
                <Button onClick={() => window.location.href = '/shop'}>Start Shopping</Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">My Orders</h2>
            
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="border border-gray-100 rounded-3xl p-6 bg-gray-50/30 transition-all hover:border-indigo-100 hover:shadow-md">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Order ID</div>
                                <div className="font-mono text-gray-900 font-bold">{order._id}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Date</div>
                                <div className="text-gray-900 font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Total</div>
                                <div className="text-gray-900 font-black">₹{order.totalAmount.toFixed(2)}</div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    order.orderStatus === 'Returned' ? 'bg-orange-100 text-orange-700' :
                                    'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {order.orderStatus}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                    order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                                    order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {order.paymentStatus === 'Refunded' ? 'Refunded to Wallet' : `Payment: ${order.paymentStatus}`}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {order.items.map((item, index) => {
                                const product = item.product || {};
                                return (
                                    <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={product.images?.[0] || '/placeholder-product.png'} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{product.name || 'Product Unavailable'}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-gray-900 pr-2">
                                            ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            {/* Cancel Order (Before shipping/delivered) */}
                            {['Pending', 'Processing'].includes(order.orderStatus) && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleCancel(order._id)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> Cancel Order
                                </Button>
                            )}

                            {/* Return Order (After delivery) */}
                            {order.orderStatus === 'Delivered' && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleReturn(order._id)}
                                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" /> Return Order
                                </Button>
                            )}
                            
                            <Button 
                                variant="outline" 
                                onClick={() => window.location.href = `/order-confirmation/${order._id}`}
                                className="gap-2"
                            >
                                <Truck className="w-4 h-4" /> View Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
