import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProductById, clearSelectedProduct } from "../../redux/features/product/productSlice";
import { selectSelectedProduct, selectProductLoading, selectProductError } from "../../redux/features/product/productSelectors";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Button from "../../components/common/Button";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const product = useAppSelector(selectSelectedProduct);
    const loading = useAppSelector(selectProductLoading);
    const error = useAppSelector(selectProductError);

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
        return () => {
            dispatch(clearSelectedProduct());
        };
    }, [id, dispatch]);

    // Update mainImage when product loads
    useEffect(() => {

        if (product?.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            productId: product.id || product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images?.[0]
        }));
        toast.success(`${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <ArrowLeft className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">{error || "The product you are looking for does not exist or has been removed."}</p>
                <Button onClick={() => navigate("/shop")} variant="primary">
                    Back to Shop
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs / Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Results
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* Images Section */}
                    <div className="p-8 bg-gray-50/50 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="w-full aspect-square rounded-2xl bg-white border border-gray-100 overflow-hidden mb-4 relative shadow-sm">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto py-2 w-full justify-center">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-indigo-600 shadow-md" : "border-transparent hover:border-gray-300"
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover bg-white" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="p-8 md:p-12 flex flex-col">
                        <div className="mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                {product.category?.name || "Uncategorized"}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-extrabold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.compareAtPrice > product.price && (
                                <span className="text-xl text-gray-400 line-through font-medium">
                                    ${product.compareAtPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-10 flex-1">
                            <p className="whitespace-pre-line text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-6 mb-6">
                                <span className="text-sm font-bold text-gray-700">Quantity</span>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm font-medium text-gray-500">
                                    {product.stock} available in stock
                                </span>
                            </div>

                            <Button
                                className="w-full py-4 text-lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
