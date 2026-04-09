import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const CategoryCard = ({ category }) => {
    const { title, image, count, slug } = category;

    return (
        <Link 
            to={`/products?category=${slug}`}
            className="group relative h-64 rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            {/* Background Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent group-hover:from-indigo-900/80 transition-colors duration-500" />

            {/* Content */}
            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                            {count} Products
                        </p>
                        <h3 className="text-white text-2xl font-bold tracking-tight">
                            {title}
                        </h3>
                    </div>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white group-hover:bg-indigo-500 transition-colors duration-300">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default memo(CategoryCard);
