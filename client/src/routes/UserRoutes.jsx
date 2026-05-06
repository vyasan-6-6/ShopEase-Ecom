import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import AddressBook from "../pages/user/AddressBook";
import NotFound from "../pages/public/NotFound";

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route path="dashboard" element={<UserDashboard />}>
                        <Route index element={<UserProfile />} />
                        <Route path="addresses" element={<AddressBook />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default UserRoutes;
