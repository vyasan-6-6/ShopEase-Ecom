import CategoryCard from "../common/CategoryCard";

const categories = [
    {
        title: "Electronics",
        slug: "electronics",
        count: "1,200+",
        image: "/category_electronics_1775671768409.png"
    },
    {
        title: "Fashion",
        slug: "fashion",
        count: "3,500+",
        image: "/category_fashion_1775672166155.png"
    },
    {
        title: "Home Decor",
        slug: "home-decor",
        count: "800+",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Beauty",
        slug: "beauty",
        count: "1,100+",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop"
    }
];

const Categories = () => {
    return (
        <section className="py-20 bg-gray-50/50">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
