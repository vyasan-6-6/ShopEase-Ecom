import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyOrders } from "../../redux/features/order/orderSlice";
import { selectMyOrders, selectOrderLoading } from "../../redux/features/order/orderSelectors";
import Button from "../../components/common/Button";
import { CheckCircle, Package, Truck, CreditCard, ChevronRight } from "lucide-react";

const OrderConfirmation = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectMyOrders);
    const loading = useAppSelector(selectOrderLoading);

    useEffect(() => {
        if (!orders || orders.length === 0) {
            dispatch(fetchMyOrders());
        }
    }, [dispatch, orders]);

    const order = useMemo(() => {
        return orders.find(o => o._id === id);
    }, [orders, id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                <p className="text-gray-500 mb-8">We couldn't find the order you're looking for.</p>
                <Link to="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
                <p className="text-gray-500">Thank you for your purchase. We've received your order.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Order ID</p>
                        <p className="text-lg font-bold font-mono text-gray-900">#{order._id}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                        <p className="text-gray-900 font-medium">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Delivery Status */}
                    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-900">Delivery Status</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                            <span className="font-semibold text-indigo-900">{order.orderStatus}</span>
                        </div>
                        <p className="text-sm text-indigo-700 mt-2">
                            Your items are currently being processed for shipment.
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                            <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-bold ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-gray-500 font-medium">Total Amount:</span>
                                <span className="font-black text-gray-900 text-base">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        Items Ordered
                    </h3>
                    <div className="space-y-4">
                        {order?.items?.map((item, index) => {
                            const product = item.product || {};
                            return (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={product.images?.[0] || '/placeholder-product.png'} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.name || 'Product Unavailable'}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">${(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Link to="/shop">
                    <Button variant="outline" className="px-8">Continue Shopping</Button>
                </Link>
                <Link to="/user/dashboard">
                    <Button className="px-8 flex items-center gap-2">
                        View Dashboard <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
