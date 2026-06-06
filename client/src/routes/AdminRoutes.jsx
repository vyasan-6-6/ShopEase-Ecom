import { Routes, Route } from "react-router-dom";
import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminProfile from "../pages/admin/AdminProfile";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageCoupon from "../pages/admin/ManageCoupon";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminReports from "../pages/admin/AdminReports";
import BannerManagement from "../pages/admin/BannerManagement";
import ManageUsers from "../pages/admin/ManageUsers";
import NotFound from "../pages/public/NotFound";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="login" element={<AdminLogin />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="dashboard" element={<AdminDashboard />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="coupons" element={<ManageCoupon />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="banners" element={<BannerManagement />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
