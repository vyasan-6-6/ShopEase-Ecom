import { useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyOrders } from "../../redux/features/order/orderSlice";
import { selectMyOrders, selectOrderLoading } from "../../redux/features/order/orderSelectors";
import Button from "../../components/common/Button";
import { CheckCircle, Package, Truck, CreditCard, ChevronRight, MapPin, Phone, Box, Clock } from "lucide-react";

const OrderConfirmation = () => {
    const { id } = useParams();
    const location = useLocation();
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
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                    {location.pathname.includes('/order-confirmation') && order.orderStatus === 'Processing' ? 'Order Confirmed!' : 'Order Details'}
                </h1>
                <p className="text-gray-500">
                    {location.pathname.includes('/order-confirmation') && order.orderStatus === 'Processing' ? "Thank you for your purchase. We've received your order." : "Review the details and status of your order below."}
                </p>
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

                {/* Order Status Timeline */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Order Status
                    </h3>
                    <div className="relative">
                        {/* Connecting Line */}
                        {['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) && (
                            <div className="absolute left-[18px] top-5 bottom-5 w-1 bg-gray-200 md:left-[16.66%] md:top-[18px] md:bottom-auto md:h-1 md:w-[66.66%]  ">
                                <div className={`bg-indigo-500 transition-all duration-1000 w-full md:h-full ${order.orderStatus === 'Processing' ? 'h-0 md:w-0' :
                                        order.orderStatus === 'Shipped' ? 'h-1/2 md:w-1/2' :
                                            'h-full md:w-full'
                                    }`}></div>
                            </div>
                        )}

                        {order.orderStatus === 'Cancelled' ? (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold text-center">
                                This order has been cancelled.
                            </div>
                        ) : order.orderStatus === 'Returned' ? (
                            <div className="bg-orange-50 text-orange-700 p-4 rounded-xl border border-orange-100 font-bold text-center">
                                This order has been returned.
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10 w-full">
                                {/* Step 1: Processing */}
                                <div className="flex md:flex-col items-center gap-4 text-center md:flex-1">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-indigo-600 ring-4 ring-white shadow-sm z-10">
                                        <Box className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Processing</h4>
                                        <p className="text-xs text-gray-500">Order confirmed</p>
                                    </div>
                                </div>
                                {/* Step 2: Shipped */}
                                <div className="flex md:flex-col items-center gap-4 text-center md:flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-white shadow-sm z-10 transition-colors ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</h4>
                                        <p className="text-xs text-gray-500">On the way</p>
                                    </div>
                                </div>
                                {/* Step 3: Delivered */}
                                <div className="flex md:flex-col items-center gap-4 text-center md:flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-white shadow-sm z-10 transition-colors ${order.orderStatus === 'Delivered' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${order.orderStatus === 'Delivered' ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</h4>
                                        <p className="text-xs text-gray-500">Package arrived</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Delivery Address */}
                    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
                        </div>
                        <div className="text-sm text-indigo-900 space-y-1 font-medium">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-100/50">
                                <Phone className="w-4 h-4 text-indigo-500" />
                                {order.shippingAddress.phone}
                            </div>
                        </div>
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
