import { X, Image as ImageIcon, Package } from "lucide-react";

const ProductViewModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <h2 className="text-xl font-black text-gray-900">
                        Product Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Images Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Images</h3>
                        {product.images && product.images.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {product.images.map((url, index) => (
                                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-2xl border-dashed">
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-500">No images uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Name</p>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Category</p>
                            <p className="font-semibold text-gray-900">{product.category?.name || "Uncategorized"}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-sm font-bold text-gray-500 mb-1">Description</p>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-2xl border border-gray-100">{product.description}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Price</p>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-gray-900">${product.price?.toFixed(2)}</span>
                                {product.compareAtPrice && (
                                    <span className="text-xs font-medium text-gray-400 line-through">${product.compareAtPrice?.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Stock</p>
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span className={`font-bold ${product.stock > 10 ? 'text-gray-700' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {product.stock} units
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Status</p>
                            <span
                                className={`inline-block text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                                    product.status === "active"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : product.status === "draft"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {product.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Slug</p>
                            <p className="font-medium text-gray-600 text-sm">{product.slug}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductViewModal;
