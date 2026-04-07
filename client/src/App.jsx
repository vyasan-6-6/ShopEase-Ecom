import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";
import { getProfile } from "./redux/features/auth/authSlice";
import { useAppDispatch } from "./redux/hooks";
import { useEffect } from "react";
import { AUTH_CONFIG } from "./config/app";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import AddressBook from "./pages/user/AddressBook";
import AdminProfile from "./pages/admin/AdminProfile"; 
function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
        if (token) {
            dispatch(getProfile());
        }
    }, [dispatch]);
    return (
        <BrowserRouter>
            <Routes> 
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route path="/user/dashboard" element={<UserDashboard />}>
                        <Route index element={<UserProfile />} />
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="addresses" element={<AddressBook />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />}>
                        <Route index element={<AdminProfile />} />
                        <Route path="profile" element={<AdminProfile />} />
                        {/* <Route path="/" element={<ManageUsers />} /> */}
                    </Route>
                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
    );
}

export default App;
