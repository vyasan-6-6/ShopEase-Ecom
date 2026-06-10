import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProductById, clearSelectedProduct, setSelectedProduct } from "../../redux/features/product/productSlice";
import { selectSelectedProduct, selectProductLoading, selectProductError } from "../../redux/features/product/productSelectors";
import { addItemToCart, addToCartLocal } from "../../redux/features/cart/cartSlice";
import productApi from "../../services/ProductService";
import { selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import { selectIsAdminAuthenticated } from "../../redux/features/auth/adminAuthSelectors";
import Button from "../../components/common/Button";
import { ArrowLeft, ShoppingCart, Loader2, Star, User } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reviewSchema } from "../../utils/reviewSchema";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const product = useAppSelector(selectSelectedProduct);
    const loading = useAppSelector(selectProductLoading);
    const error = useAppSelector(selectProductError);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);
    
    // Only select the specific product from cache to avoid unnecessary re-renders
    const cachedProduct = useAppSelector((state) => state.product.productCache[id]);

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");

    // Image Zoom states
    const [isZooming, setIsZooming] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');

    // Review states
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(reviewSchema),
        defaultValues: {
            rating: 5,
            comment: ""
        }
    });

    const currentRating = watch("rating");

    useEffect(() => {
        if (id) {
            // Check cache first using the specific selector
            if (cachedProduct) {
                dispatch(setSelectedProduct(cachedProduct));
            } else {
                // If not in cache, fetch from API
                dispatch(fetchProductById(id));
            }
            fetchReviews(id);
        }
        // Removed the clearSelectedProduct on unmount so the UI doesn't stutter on navigation
    }, [id, dispatch]); // Intentionally omitting cachedProduct to run only on ID change

    // Update mainImage when product loads
    useEffect(() => {
        if (product?.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    const fetchReviews = async (productId) => {
        try {
            const res = await productApi.getProductReviews(productId);
            setReviews(res.data?.reviews || []);
            setCanReview(res.data?.canReview || false);
        } catch (error) {
            console.error("Failed to fetch reviews");
        }
    };

    const onSubmitReview = async (data) => {
        try {
            setSubmittingReview(true);
            const res = await productApi.addReview(id, data);
            toast.success("Review submitted successfully!");
            setCanReview(false);
            reset(); // resets to default rating 5 and empty comment
            // Refetch product to get updated average rating and reviews list
            dispatch(fetchProductById(id));
            fetchReviews(id);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        const productId = product.id || product._id;

        if (isAuthenticated || isAdminAuthenticated) {
            dispatch(addItemToCart({ productId, quantity }))
                .unwrap()
                .then(() => toast.success("Added to cart!"))
                .catch((err) => toast.error(err || "Failed to add to cart"));
        } else {
            dispatch(addToCartLocal({ 
                productId, 
                product: {
                    id: productId,
                    name: product.name,
                    price: product.price,
                    images: product.images
                }, 
                quantity 
            }));
            toast.success("Added to cart!");
        }
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
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

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* Images Section */}
                    <div className="p-8 bg-gray-50/50 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
                        <div 
                            className="w-full aspect-square rounded-2xl bg-white border border-gray-100 overflow-hidden mb-4 relative shadow-sm md:cursor-crosshair"
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            onMouseMove={handleMouseMove}
                            onTouchStart={(e) => {
                                setIsZooming(true);
                                // Trigger initial position calculation for touch
                                const touch = e.touches[0];
                                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                const x = ((touch.clientX - left) / width) * 100;
                                const y = ((touch.clientY - top) / height) * 100;
                                setBackgroundPosition(`${x}% ${y}%`);
                            }}
                            onTouchEnd={() => setIsZooming(false)}
                            onTouchMove={(e) => {
                                const touch = e.touches[0];
                                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                const x = ((touch.clientX - left) / width) * 100;
                                const y = ((touch.clientY - top) / height) * 100;
                                setBackgroundPosition(`${x}% ${y}%`);
                            }}
                        >
                            {mainImage ? (
                                <>
                                    {/* Base Image (Fades out on mobile, stays visible on desktop) */}
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                                    />
                                    
                                    {/* In-Place Zoom Overlay - Visible on all devices */}
                                    {isZooming && (
                                        <div 
                                            className="absolute inset-0 z-10 pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${mainImage})`,
                                                backgroundPosition: backgroundPosition,
                                                backgroundSize: '250%',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                    )}
                                </>
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

                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`w-5 h-5 ${star <= (product.averageRating || 0) ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-700">
                                {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
                            </span>
                            <span className="text-sm font-medium text-gray-400">
                                ({product.reviewCount || 0} reviews)
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-extrabold text-gray-900">
                                ₹{product.price.toFixed(2)}
                            </span>
                            {product.compareAtPrice > product.price && (
                                <span className="text-xl text-gray-400 line-through font-medium">
                                    ₹{product.compareAtPrice.toFixed(2)}
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

                            {product.status === "draft" ? (
                                <Button
                                    className="w-full py-4 text-lg bg-amber-100 text-amber-700 hover:bg-amber-200 border-none disabled:bg-amber-100 disabled:text-amber-700 disabled:opacity-100"
                                    disabled={true}
                                >
                                    Available Soon
                                </Button>
                            ) : (
                                <Button
                                    className="w-full py-4 text-lg"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>


            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Star className="w-6 h-6 text-indigo-600 fill-indigo-600" />
                    Customer Reviews
                </h2>

                {/* Review Form */}
                {canReview && (
                    <form onSubmit={handleSubmit(onSubmitReview)} className="mb-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setValue("rating", star, { shouldValidate: true })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-8 h-8 ${star <= currentRating ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`} />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                            <textarea
                                {...register("comment")}
                                rows="3"
                                className={`w-full bg-white border ${errors.comment ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-600'} rounded-xl p-3 text-sm focus:ring-2 focus:border-transparent outline-none transition-all`}
                                placeholder="Share your experience with this product..."
                            ></textarea>
                            {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
                        </div>
                        <Button type="submit" loading={submittingReview}>
                            Submit Review
                        </Button>
                    </form>
                )}

                {/* Review List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                                        {review.user?.avatar ? (
                                            <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{review.user?.name || "Verified Buyer"}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        className={`w-3 h-3 ${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm pl-12 mt-3 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 font-medium">
                            No reviews yet. Be the first to review!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
