import { memo } from "react";

const Contact = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
                We'd love to hear from you! Whether you have a question about our products, shipping, returns, or anything else, our team is ready to answer all your questions.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4 w-full max-w-md">
                <div className="text-left">
                    <p className="font-semibold text-gray-900">Email Address</p>
                    <a href="mailto:support@shopease.com" className="text-indigo-600 hover:text-indigo-800 transition-colors">support@shopease.com</a>
                </div>
                <div className="text-left">
                    <p className="font-semibold text-gray-900">Phone Number</p>
                    <p className="text-gray-600">+1 (212) 555-0123</p>
                </div>
                <div className="text-left">
                    <p className="font-semibold text-gray-900">Headquarters</p>
                    <p className="text-gray-600">123 Market St, New York, NY 10001</p>
                </div>
            </div>
        </div>
    );
};

export default memo(Contact);
