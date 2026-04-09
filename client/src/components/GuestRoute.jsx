import { Navigate, Outlet } from "react-router-dom";
import { selectUser, selectAuthLoading } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";

// Blocks logged-in users from accessing auth pages (login, register, forgot-password)
// If authenticated → redirect to dashboard
// If not authenticated → show the page (Outlet)
const GuestRoute = () => {
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);

    // While getProfile is running on page refresh, wait — don't flash the login page
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Already logged in → kick them to the dashboard
    if (user) {
        return <Navigate to="/user/dashboard" replace />;
    }

    // Not logged in → let them through
    return <Outlet />;
};

export default GuestRoute;
