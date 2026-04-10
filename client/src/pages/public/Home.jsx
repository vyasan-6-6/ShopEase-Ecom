import { memo } from "react";
import Hero from "../../components/home/Hero";
import Offers from "../../components/home/Offers";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Testimonials from "../../components/home/Testimonials";
import CTABanner from "../../components/home/CTABanner";

const Home = () => {
    return (
        <div className="flex flex-col w-full">
            <Hero />
            <Offers />
            <Categories />
            <FeaturedProducts />
            <Testimonials />
            <CTABanner /> 
        </div>
    );
};

export default memo(Home);
