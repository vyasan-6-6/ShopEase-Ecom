import { memo } from "react";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import CTABanner from "../../components/home/CTABanner";

const Home = () => {
    return (
        <div className="flex flex-col w-full">
            <Hero />
            <Categories />
            <FeaturedProducts />
            <CTABanner /> 
        </div>
    );
};

export default memo(Home);
