import { ShoppingCart, Star, Eye } from "lucide-react"; 
import { memo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addItemToCart, addToCartLocal } from "../../redux/features/cart/cartSlice";
import { selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { selectIsAdminAuthenticated } from "../../redux/features/auth/adminAuthSelectors"; 
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
    const dispatch = useAppDispatch(); 
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);

    // Destructure real DB properties with fallbacks for dummy data
    const id = product.id || product._id;
    const name = product.name || product.title;
    const price = product.price;
    const image = product.images?.[0] || product.image;
    const rating = product.averageRating || 4.5;
    const categoryName = product.category?.name || product.category || "Uncategorized";
    const status = product.status || "active";

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(addItemToCart({ productId: id, quantity: 1 }))
                .unwrap()
                .then(() => toast.success("Added to cart!"))
                .catch((err) => toast.error(err || "Failed to add item"));
        } else {
            dispatch(addToCartLocal({ 
                productId: id, 
                product: {
                    id: id,
                    name: name,
                    price: price,
                    images: product.images || [image]
                }, 
                quantity: 1 
            }));
            toast.success("Added to cart!");
        }
    };

    return (
        <Link 
            to={`/product/${id}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                )}
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded-full shadow-sm">
                        {categoryName}
                    </span>
                    {status === "draft" && isAdminAuthenticated && (
                        <span className="px-3 py-1 bg-amber-100/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-700 rounded-full shadow-sm border border-amber-200">
                            Draft
                        </span>
                    )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="p-2 bg-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                </div>
                
                <h3 className="text-gray-900 font-semibold mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {name}
                </h3>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">${price?.toFixed(2)}</span>
                    
                    {status === "draft" ? (
                        <div className="h-10 flex items-center justify-center text-sm font-bold text-amber-700 bg-amber-100/50 px-4 rounded-xl border border-amber-200/50">
                            Available Soon
                        </div>
                    ) : (
                        <button 
                            onClick={handleAddToCart}
                            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default memo(ProductCard);
