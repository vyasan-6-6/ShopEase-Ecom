import { memo, useEffect, useState } from "react";
import { Star, Quote, User } from "lucide-react";
import productApi from "../../services/ProductService";

const fallbackTestimonials = [
    {
        _id: 1,
        user: {
            name: "Sarah Jenkins",
            avatar: "https://i.pravatar.cc/150?img=47",
        },
        comment: "I absolutely love shopping here! The quality is unmatched, and my order arrived two days earlier than expected. The 20% welcome bonus was the cherry on top. Will definitely buy again.",
        rating: 5,
    },
    {
        _id: 2,
        user: {
            name: "Michael Chen",
            avatar: "https://i.pravatar.cc/150?img=11",
        },
        comment: "The electronics selection is fantastic. I used the Flash15 coupon and got a huge discount on my new headphones. Best customer service I've experienced in a long time.",
        rating: 5,
    },
    {
        _id: 3,
        user: {
            name: "Jessica Rivera",
            avatar: "https://i.pravatar.cc/150?img=9",
        },
        comment: "The website is so easy to use! Finding what I needed took seconds, and the checkout process was seamless. The clothes fit perfectly and the quality blew me away.",
        rating: 5,
    },
];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await productApi.getLatestReviews();
                if (res.data?.reviews?.length >= 3) {
                    setTestimonials(res.data.reviews);
                } else {
                    setTestimonials(fallbackTestimonials);
                }
            } catch (error) {
                setTestimonials(fallbackTestimonials);
            }
        };

        fetchReviews();
    }, []);
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
                        Loved by thousands of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Happy Customers</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        Don't just take our word for it. See what our community has to say about their ShopEase experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div 
                            key={testimonial._id}
                            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300"
                        >
                            {/* Decorative Quote Icon Background */}
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-indigo-50 opacity-50 group-hover:text-indigo-100 transition-colors duration-300" />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            
                            <p className="text-gray-700 text-lg leading-relaxed mb-8 italic relative z-10 font-medium line-clamp-4">
                                "{testimonial.comment}"
                            </p>
                            
                            <div className="flex items-center gap-4 mt-auto border-t border-gray-50 pt-6">
                                {testimonial.user?.avatar ? (
                                    <img 
                                        src={testimonial.user.avatar} 
                                        alt={testimonial.user.name}
                                        className="w-12 h-12 rounded-full object-cover shadow-md"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-md">
                                       <User className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.user?.name || "Verified Buyer"}</h4>
                                    <p className="text-sm font-semibold text-indigo-600">Verified Buyer</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(Testimonials);
