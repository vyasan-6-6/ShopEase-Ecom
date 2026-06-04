import { useEffect } from "react";
import CategoryCard from "../common/CategoryCard";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectActiveCategories, selectCategoryLoading } from "../../redux/features/category/categorySelectors";

const Categories = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectActiveCategories);
    const loading = useAppSelector(selectCategoryLoading);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <section className="py-20 bg-gray-50/50" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                            Explore Top <span className="text-indigo-600">Categories</span>
                        </h2>
                        <p className="mt-4 text-gray-600 font-medium">
                            Whether you're looking for the latest tech or the newest trends, we've got 
                            a collection for every lifestyle.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <p className="text-gray-500 text-lg">No categories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.slice(0,4).map((category) => (
                            <CategoryCard key={category.id || category._id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Categories;
