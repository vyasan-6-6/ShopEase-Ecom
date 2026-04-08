import { memo } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                    <div>
                        <h3 className="text-xl font-bold">ShopEase</h3>
                        <p className="text-gray-400 text-sm mt-1">Your one-stop shop for everything.</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <Link to="/about" className="hover:text-white transition">
                            About Us
                        </Link>
                        <Link to="/contact" className="hover:text-white transition">
                            Contact
                        </Link>
                        <Link to="/faq" className="hover:text-white transition">
                            FAQ
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
