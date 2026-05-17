import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchPublicProducts } from "../../redux/features/product/productSlice";
import ProductCard from "../../components/common/ProductCard";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectPublicProducts, selectProductPagination, selectProductLoading } from "../../redux/features/product/productSelectors";
import { selectActiveCategories, selectCategoryLoading } from "../../redux/features/category/categorySelectors";
import Button from "../../components/common/Button";

const Shop = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(selectPublicProducts);
    const pagination = useSelector(selectProductPagination);
    const productsLoading = useSelector(selectProductLoading); 

    const categories = useSelector(selectActiveCategories);
    const categoriesLoading = useSelector(selectCategoryLoading);

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const [selectedCategory, setSelectedCategory] = useState(category || "");
    const [searchQuery, setSearchQuery] = useState(search || "");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPublicProducts({ 
            page: currentPage, 
            limit: 10, 
            category: selectedCategory,
            search: searchQuery 
        }));
    }, [dispatch, currentPage, selectedCategory, searchQuery]);

    useEffect(() => { 
        setSelectedCategory(category || ""); 
        setSearchQuery(search || "");
        setCurrentPage(1);
    }, [category, search]);

    const handleCategoryClick = (categoryId) => {
        setSearchParams({ category:categoryId });// this for url change 
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to first page when category changes
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Shop All Products</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar - Categories */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
                        {categoriesLoading ? (
                            <p className="text-gray-500 text-sm">Loading categories...</p>
                        ) : (
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleCategoryClick("")}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === ""
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleCategoryClick(cat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                {/* Main Content - Products Grid */}
                <main className="flex-1">
                    {productsLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <p className="text-gray-500 text-lg">No products found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                {products.map((product) => (
                                    <ProductCard key={product.id || product._id} product={product} />
                                ))}
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
                                                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${currentPage === page
                                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                            : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-600 hover:text-indigo-600"
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
                </main>
            </div>
        </div>
    );
};

export default Shop;
