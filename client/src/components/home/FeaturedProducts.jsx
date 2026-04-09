import ProductCard from "../common/ProductCard";

const products = [
    {
        id: 1,
        title: "Premium Wireless Over-Ear Headphones",
        price: 299,
        category: "Electronics",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Minimalist Leather Luxury Watch",
        price: 159,
        category: "Fashion",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Smart Ergonomic Office Chair",
        price: 549,
        category: "Home",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" // Placeholder
    },
    {
        id: 4,
        title: "Professional Camera Lens Kit",
        price: 1299,
        category: "Electronics",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1526170315870-ef6d82f5832d?q=80&w=600&auto=format&fit=crop"
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight text-center md:text-left">
                            Featured <span className="text-indigo-600">Picks</span>
                        </h2>
                        <p className="mt-4 text-gray-600 font-medium text-center md:text-left">
                            Our most popular items chosen by thousands of customers worldwide.
                        </p>
                    </div>
                    <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all active:scale-95">
                        View All Products
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
