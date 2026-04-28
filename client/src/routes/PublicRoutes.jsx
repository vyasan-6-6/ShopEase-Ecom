import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import GuestRoute from "../components/GuestRoute";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/public/NotFound";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                
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
