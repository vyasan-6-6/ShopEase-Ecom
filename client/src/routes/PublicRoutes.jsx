import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/public/Home";
import Shop from "../pages/public/Shop";
import SingleProduct from "../pages/public/SingleProduct";
import Cart from "../pages/public/Cart";
import Checkout from "../pages/user/Checkout";
import OrderConfirmation from "../pages/user/OrderConfirmation";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/public/NotFound";
import ServerError from "../pages/public/ServerError";
import Contact from "../pages/public/Contact";
import FAQ from "../pages/public/FAQ";
import Shipping from "../pages/public/Shipping";
import Returns from "../pages/public/Returns";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<SingleProduct />} />
                <Route path="cart" element={<Cart />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="returns" element={<Returns />} />
                <Route path="500" element={<ServerError />} />
                
                <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
                </Route>
                
                {/* Guest-only: logged-in users are redirected to dashboard */}
                <Route element={<GuestRoute />}>
                    <Route path="auth/login" element={<Login />} />
                    <Route path="auth/register" element={<Register />} />
                    <Route path="auth/forgot-password" element={<ForgotPassword />} />
                </Route>
            </Route>
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default PublicRoutes;
