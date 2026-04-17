import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";

// Blocks logged-in users from accessing auth pages (login, register, forgot-password)
// If authenticated → redirect to dashboard
// If not authenticated → show the page (Outlet)
const GuestRoute = () => {
    const user = useAppSelector(selectUser);

    // Already logged in → kick them to their respective dashboard
    if (user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/user/dashboard" replace />;
    }

    // Not logged in → let them through
    return <Outlet />;
};

export default GuestRoute;
