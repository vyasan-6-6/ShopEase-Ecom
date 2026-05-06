import { Navigate, Outlet } from "react-router-dom";
import { selectAuthLoading, selectUser } from "../redux/features/auth/authSelectors";
import { selectAdmin, selectAdminLoading } from "../redux/features/auth/adminAuthSelectors";
import { useAppSelector } from "../redux/hooks";

// Accepts an array of allowed roles, e.g., ["admin"] or ["user"]
const ProtectedRoute = ({ allowedRoles = ["user"] }) => {
    const isAdminRoute = allowedRoles.includes("admin");
    
    // Select state based on route type
    const user = useAppSelector(selectUser);
    const admin = useAppSelector(selectAdmin);
    const userLoading = useAppSelector(selectAuthLoading);
    const adminLoading = useAppSelector(selectAdminLoading);

    const currentUser = isAdminRoute ? admin : user;
    const isLoading = isAdminRoute ? adminLoading : userLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to={isAdminRoute ? "/admin/login" : "/auth/login"} replace />;
    }

    // Role check (for mixed role routes if any)
    if (!allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
