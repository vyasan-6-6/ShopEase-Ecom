import { memo } from "react";

const FAQ = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
                Find answers to the most common questions about our products, orders, and services.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left w-full max-w-2xl space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">How long does shipping take?</h3>
                    <p className="text-gray-600">Standard shipping usually takes 3-5 business days. Expedited shipping is available at checkout.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">What is your return policy?</h3>
                    <p className="text-gray-600">We offer a 30-day money-back guarantee on all our products. Please see our returns page for more details.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Do you ship internationally?</h3>
                    <p className="text-gray-600">Currently, we only ship within the United States and Canada, but we are looking to expand soon!</p>
                </div>
            </div>
        </div>
    );
};

export default memo(FAQ);
