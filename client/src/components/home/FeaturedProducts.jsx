import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPublicProducts } from "../../redux/features/product/productSlice";
import { selectPublicProducts, selectProductLoading } from "../../redux/features/product/productSelectors";

const FeaturedProducts = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const products = useAppSelector(selectPublicProducts);
    const isLoading = useAppSelector(selectProductLoading);

    useEffect(() => {
        // Fetch products with a limit for featured section
        dispatch(fetchPublicProducts({ limit: 4 }));
    }, [dispatch]);

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight text-center md:text-left">
                            Featured <span className="text-indigo-600">Picks</span>
                        </h2>
                        <p className="mt-4 text-gray-600 font-medium text-center md:text-left">
                            Our most popular items chosen by thousands of customers worldwide.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate("/shop")}
                        className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                        View All Products
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse flex flex-col h-full">
                                <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No products found. Start adding some!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
