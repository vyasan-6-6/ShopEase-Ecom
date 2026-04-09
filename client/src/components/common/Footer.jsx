import { memo } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl font-black tracking-tight">
                                Shop<span className="text-indigo-400">Ease</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Step into a world of curated style and quality. Your ultimate 
                            destination for fashion, tech, and beyond.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2.5 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-colors" title="Website">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a href="mailto:support@shopease.com" className="p-2.5 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-colors" title="Mail">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                            <li><Link to="/offers" className="text-gray-400 hover:text-white transition-colors">Special Offers</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Get In Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-gray-400">
                                <MapPin className="w-5 h-5 text-indigo-400" />
                                <span>123 Market St, New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Phone className="w-5 h-5 text-indigo-400" />
                                <span>+1 (212) 555-0123</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Mail className="w-5 h-5 text-indigo-400" />
                                <span>support@shopease.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} ShopEase E-commerce. Built with pride.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
