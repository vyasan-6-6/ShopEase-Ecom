import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchPublicProducts } from "../../redux/features/product/productSlice";
import ProductCard from "../../components/common/ProductCard";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectPublicProducts, selectProductPagination, selectProductLoading } from "../../redux/features/product/productSelectors";
import { selectActiveCategories } from "../../redux/features/category/categorySelectors";
import Button from "../../components/common/Button";
import { Star, X, SlidersHorizontal } from "lucide-react";

const Shop = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectPublicProducts);
    const pagination = useSelector(selectProductPagination);
    const productsLoading = useSelector(selectProductLoading);

    const categories = useSelector(selectActiveCategories);

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const minParam = searchParams.get("minPrice") || "";
    const maxParam = searchParams.get("maxPrice") || "";
    const ratingParam = searchParams.get("rating") || "";
    const pageParam = searchParams.get("page") || "1";

    const selectedCategory = category;
    const searchQuery = search;
    const sortOrder = sort;
    const selectedRating = ratingParam ? Number(ratingParam) : "";
    const currentPage = Number(pageParam);

    const [minPrice, setMinPrice] = useState(minParam);
    const [maxPrice, setMaxPrice] = useState(maxParam);

    // Sync input states when URL changes (derived state update pattern to avoid useEffect set-state)
    const [prevMinParam, setPrevMinParam] = useState(minParam);
    const [prevMaxParam, setPrevMaxParam] = useState(maxParam);

    if (minParam !== prevMinParam) {
        setMinPrice(minParam);
        setPrevMinParam(minParam);
    }
    if (maxParam !== prevMaxParam) {
        setMaxPrice(maxParam);
        setPrevMaxParam(maxParam);
    }

    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: currentPage,
            limit: 10,
            category: selectedCategory,
            search: searchQuery,
            sort: sortOrder
        };
        if (minParam) params.minPrice = minParam;
        if (maxParam) params.maxPrice = maxParam;
        if (selectedRating) params.rating = selectedRating.toString();
        dispatch(fetchPublicProducts(params));
    }, [dispatch, currentPage, selectedCategory, searchQuery, sortOrder, minParam, maxParam, selectedRating]);

    const handleCategoryClick = (categoryId) => {
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            if (categoryId) p.set("category", categoryId);
            else p.delete("category");
            p.set("page", "1");
            return p;
        });
    };

    const handleRatingClick = (ratingValue) => {
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            if (ratingValue) p.set("rating", ratingValue.toString());
            else p.delete("rating");
            p.set("page", "1");
            return p;
        });
    };

    const handlePriceApply = () => {
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            if (minPrice) p.set("minPrice", minPrice);
            else p.delete("minPrice");
            if (maxPrice) p.set("maxPrice", maxPrice);
            else p.delete("maxPrice");
            p.set("page", "1");
            return p;
        });
    };

    const handlePriceClear = () => {
        setMinPrice("");
        setMaxPrice("");
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            p.delete("minPrice");
            p.delete("maxPrice");
            p.set("page", "1");
            return p;
        });
    };

    const clearSearch = () => {
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            p.delete("search");
            p.set("page", "1");
            return p;
        });
    };

    const handleClearAll = () => {
        setMinPrice("");
        setMaxPrice("");
        setSearchParams(prev => {
            const p = new URLSearchParams();
            const currentSort = prev.get("sort");
            if (currentSort) p.set("sort", currentSort);
            p.set("page", "1");
            return p;
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
            setSearchParams(prev => {
                const p = new URLSearchParams(prev);
                p.set("page", newPage.toString());
                return p;
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Area */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Shop All Products
                </h1>
                <p className="text-gray-500 text-lg">
                    Discover premium essentials crafted for style, comfort, and performance.
                </p>
            </div>

            {/* Filter Toggle and Sort Row */}
            <div className="flex justify-between items-center mb-8 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all cursor-pointer"
                >
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 hidden sm:inline">Sort By:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            setSearchParams(prev => {
                                const p = new URLSearchParams(prev);
                                p.set("sort", e.target.value);
                                return p;
                            });
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Filters Dashboard (Tailwind Grid) */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 transition-all duration-300">
                    {/* Category Column */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-60">
                        <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">Category</h3>
                        <div className="space-y-1 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                            <button
                                onClick={() => handleCategoryClick("")}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedCategory === ""
                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                All Products
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedCategory === cat.id
                                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Column */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-60 justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">Price Range</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">$</span>
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full bg-gray-50 border-transparent rounded-xl py-2.5 pl-7 pr-3 text-sm focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        min="0"
                                    />
                                </div>
                                <span className="text-gray-400 font-medium">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">$</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full bg-gray-50 border-transparent rounded-xl py-2.5 pl-7 pr-3 text-sm focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={handlePriceApply}
                                className="flex-1 py-2.5 text-sm font-semibold shadow-md shadow-indigo-100 cursor-pointer"
                            >
                                Apply Price
                            </Button>
                            {(minPrice || maxPrice) && (
                                <button
                                    onClick={handlePriceClear}
                                    className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Rating Column */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-60">
                        <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">Minimum Rating</h3>
                        <div className="space-y-1 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingClick(rating)}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${selectedRating === rating
                                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                            />
                                        ))}
                                        <span className="ml-1.5 text-xs font-medium text-gray-500">
                                            {rating === 5 ? "Only" : "& Up"}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        ({rating === 5 ? "5.0" : `>= ${rating}.0`})
                                    </span>
                                </button>
                            ))}
                            <button
                                onClick={() => handleRatingClick("")}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedRating === ""
                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                All Ratings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Summary Chips */}
            {(selectedCategory || searchQuery || minParam || maxParam || selectedRating) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">Active:</span>
                    
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full pl-3 pr-2 py-1 text-xs font-semibold">
                            Search: "{searchQuery}"
                            <button onClick={clearSearch} className="hover:text-red-500 transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}

                    {selectedCategory && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full pl-3 pr-2 py-1 text-xs font-semibold">
                            Category: {categories.find(c => c.id === selectedCategory)?.name || "Selected"}
                            <button onClick={() => handleCategoryClick("")} className="hover:text-red-500 transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}

                    {(minParam || maxParam) && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full pl-3 pr-2 py-1 text-xs font-semibold">
                            Price: {minParam ? `$${minParam}` : "$0"} - {maxParam ? `$${maxParam}` : "∞"}
                            <button onClick={handlePriceClear} className="hover:text-red-500 transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}

                    {selectedRating && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full pl-3 pr-2 py-1 text-xs font-semibold">
                            Rating: {selectedRating}★ & Up
                            <button onClick={() => handleRatingClick("")} className="hover:text-red-500 transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    )}

                    <button
                        onClick={handleClearAll}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors underline cursor-pointer ml-1"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Products Listing Grid */}
            <div>
                <p className="text-gray-400 text-sm font-semibold mb-4 tracking-wide uppercase">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
                </p>

                <div className={`transition-all duration-300 ${productsLoading ? 'opacity-65 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'}`}>
                    {products.length === 0 && !productsLoading ? (
                        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm animate-fade-in">
                            <p className="text-gray-500 text-lg font-medium mb-2">No products match your criteria.</p>
                            <p className="text-gray-400 text-sm">Try widening your search terms or clearing active filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                                {productsLoading ? (
                                    [...Array(8)].map((_, idx) => (
                                        <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 animate-pulse-slow">
                                            <div className="w-full aspect-square bg-gray-50 rounded-2xl"></div>
                                            <div className="h-4 bg-gray-50 rounded-lg w-2/3"></div>
                                            <div className="h-3 bg-gray-50 rounded-lg w-1/2"></div>
                                            <div className="flex justify-between items-center pt-2">
                                                <div className="h-5 bg-gray-50 rounded-lg w-1/4"></div>
                                                <div className="h-8 bg-gray-50 rounded-xl w-1/3"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    products.map((product) => (
                                        <div key={product.id || product._id} className="animate-fade-in">
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                )}
                            </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>

                                <div className="flex gap-1">
                                    {[...Array(pagination.totalPages)].map((_, idx) => {
                                        const page = idx + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page
                                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                    : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 cursor-pointer"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
);
};

export default Shop;
