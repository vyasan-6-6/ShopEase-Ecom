import { memo } from "react";

const Returns = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center p-8 bg-gray-50">
            <div className="max-w-3xl w-full">
                <h1 className="text-4xl font-black text-gray-900 mb-6 text-center">Returns & Refunds</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We want you to be completely satisfied with your purchase. If you are not entirely happy, we're here to help.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-gray-900">30-Day Return Policy</h3>
                    <p className="text-gray-600">
                        You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900">Refund Process</h3>
                    <p className="text-gray-600">
                        Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment or to your ShopEase wallet. You will receive the credit within a certain amount of days, depending on your card issuer's policies.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900">Non-Refundable Items</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Gift cards</li>
                        <li>Downloadable software products</li>
                        <li>Some health and personal care items</li>
                        <li>Items purchased on final clearance sale</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default memo(Returns);
