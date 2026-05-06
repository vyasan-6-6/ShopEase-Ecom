import { Routes, Route } from "react-router-dom";
import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminProfile from "../pages/admin/AdminProfile";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageProducts from "../pages/admin/ManageProducts";
import NotFound from "../pages/public/NotFound";

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Admin login — no MainLayout */}
            <Route element={<GuestRoute />}>
                <Route path="login" element={<AdminLogin />} />
            </Route>

            {/* Admin protected routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="dashboard" element={<AdminDashboard />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
