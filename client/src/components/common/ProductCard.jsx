import { ShoppingCart, Star } from "lucide-react"; 
import { memo } from "react";

const ProductCard = ({ product }) => {
    const { title, price, image, rating, category } = product;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded-full shadow-sm">
                        {category}
                    </span>
                    {product.status === "draft" && (
                        <span className="px-3 py-1 bg-amber-100/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-700 rounded-full shadow-sm border border-amber-200">
                            Draft
                        </span>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                </div>
                
                <h3 className="text-gray-900 font-semibold mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {title}
                </h3>

                <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">${price}</span>
                    <button className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
