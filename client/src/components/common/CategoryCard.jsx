import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const CategoryCard = ({ category }) => {
    const { name, id } = category;
    
    
    const getCategoryImage = (catName) => {
        const nameStr = (catName || "").toLowerCase();
        if (nameStr.includes('electronic') || nameStr.includes('tech')) {
            return "/category_electronics_1775671768409.png";
        }
        if (nameStr.includes('fashion') || nameStr.includes('cloth') || nameStr.includes('apparel')) {
            return "/category_fashion_1775672166155.png";
        }
        if (nameStr.includes('home') || nameStr.includes('decor') || nameStr.includes('furniture')) {
            return "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop";
        }
        if (nameStr.includes('beauty') || nameStr.includes('cosmetic') || nameStr.includes('health')) {
            return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop";
        }
        if (nameStr.includes('sport') || nameStr.includes('outdoor') || nameStr.includes('fitness')) {
            return "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop";
        }
        // Beautiful fallback default
        return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=600&auto=format&fit=crop";
    };

    const imageToUse = getCategoryImage(name);

    return (
        <Link 
            to={`/shop?category=${id}`}
            className="group relative h-64 rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            <img
                src={imageToUse}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent group-hover:from-indigo-900/80 transition-colors duration-500" />

            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                            Explore
                        </p>
                        <h3 className="text-white text-2xl font-bold tracking-tight">
                            {name}
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
