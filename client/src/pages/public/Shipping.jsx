import { memo } from "react";

const Shipping = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center p-8 bg-gray-50">
            <div className="max-w-3xl w-full">
                <h1 className="text-4xl font-black text-gray-900 mb-6 text-center">Shipping Information</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed">
                        At ShopEase, we strive to deliver your purchases as quickly and safely as possible. We partner with reliable carriers to ensure your orders arrive on time.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-gray-900">Processing Time</h3>
                    <p className="text-gray-600">
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900">Shipping Rates & Delivery Estimates</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li><strong>Standard Shipping:</strong> 3-5 business days (Free on orders over $50)</li>
                        <li><strong>Two-Day Shipping:</strong> 2 business days ($15.00)</li>
                        <li><strong>Overnight Delivery:</strong> 1 business day ($25.00)</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900">Order Tracking</h3>
                    <p className="text-gray-600">
                        Once your order has shipped, you will receive a Shipment Confirmation email containing your tracking number(s). The tracking number will be active within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default memo(Shipping);
