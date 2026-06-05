import { memo } from "react";
import Hero from "../../components/home/Hero";
import Offers from "../../components/home/Offers";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Testimonials from "../../components/home/Testimonials";
import CTABanner from "../../components/home/CTABanner";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { selectAdmin } from "../../redux/features/auth/adminAuthSelectors";
import BannerSlider from "../../components/home/BannerSlider";

const Home = () => {
    const user = useAppSelector(selectUser);
    const admin = useAppSelector(selectAdmin);
    return (
        <div className="flex flex-col w-full">
            <BannerSlider/>
            <Hero />
            <Offers />
            <Categories />
            <FeaturedProducts />
            <Testimonials />
            
            {!user && !admin && <CTABanner />}
        </div>
    );};

export default memo(Home);
