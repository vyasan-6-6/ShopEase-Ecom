import { useState, useEffect } from "react";

import bannerApi from "../../services/BannerService";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Fetch the active banners using the public endpoint
                const res = await bannerApi.getAllBanners();
                if (res.data?.banners) {
                    setBanners(res.data.banners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading || banners.length === 0) return null;

    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 pt-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative group bg-gray-100">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    className="w-full aspect-[21/9] md:aspect-[24/8]"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                                <div className="w-full h-full relative overflow-hidden">
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
                                </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BannerSlider;
