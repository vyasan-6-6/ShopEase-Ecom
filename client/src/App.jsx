import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";
import { getProfile, getAdminProfile } from "./redux/features/auth/authSlice"; 
import { useAppDispatch } from "./redux/hooks";
import { useEffect, useState } from "react";
import { AUTH_CONFIG } from "./config/app";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import AddressBook from "./pages/user/AddressBook";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminOverview from "./pages/admin/AdminOverview";
import NotFound from "./pages/public/NotFound";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
    const dispatch = useAppDispatch();
    const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            // Identify both possible tokens
            const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
            const adminToken = localStorage.getItem(AUTH_CONFIG.adminKey);

            // Fetch either (or both) profiles if tokens exist
            if (token) {
                await dispatch(getProfile());
            }
            if (adminToken) {
                await dispatch(getAdminProfile());
            }

            // Once finished checking, let the router boot up.
            setIsVerifyingAuth(false);
        };

        verifyAuth();//we call this function to verify the authentication of the user and if the user is authenticated then it will redirect to the dashboard and if not then it will redirect to the login page 
    }, [dispatch]);

    if (isVerifyingAuth) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Verifying session...</p>
                </div>
            </div>
        );
    }

    return (
            <BrowserRouter> 
                <ScrollToTop />
                <Routes>
                {/* Public + Guest-only routes inside MainLayout */}
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />

                    {/* Guest-only: logged-in users are redirected to dashboard */}
                    <Route element={<GuestRoute />}>
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    </Route>
                </Route>

                {/* Admin login — no MainLayout */}
                <Route element={<GuestRoute />}>
                    <Route path="/admin/login" element={<AdminLogin />} />
                </Route>

                {/* User protected routes */}
                <Route element={<MainLayout />}>
                    <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                        <Route path="/user/dashboard" element={<UserDashboard />}>
                            <Route index element={<UserProfile />} />
                            <Route path="addresses" element={<AddressBook />} />
                        </Route>
                    </Route>
                </Route>

                {/* Admin protected routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />}>
                        <Route index element={<AdminOverview />} />
                        <Route path="profile" element={<AdminProfile />} />
                    </Route>
                </Route>

                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
    );
}

export default App;
