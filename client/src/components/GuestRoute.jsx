import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../redux/features/auth/authSelectors";
import { selectAdmin, selectIsAdminAuthenticated } from "../redux/features/auth/adminAuthSelectors";
import { useAppSelector } from "../redux/hooks";

// Blocks logged-in users from accessing auth pages (login, register, forgot-password)
// If authenticated → redirect to dashboard
// If not authenticated → show the page (Outlet)
const GuestRoute = () => {
    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    
    const admin = useAppSelector(selectAdmin);
    const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);

    // If Admin is logged in and tries to access a guest route
    if (isAdminAuthenticated && admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // If User is logged in and tries to access a guest route
    if (isAuthenticated && user) {
        return <Navigate to="/" replace />;
    }

    // Not logged in → let them through
    return <Outlet />;
};

export default GuestRoute;
