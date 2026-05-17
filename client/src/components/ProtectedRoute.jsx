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

    let currentUser = null;
    let isLoading = false;

    // Check if it allows multiple roles
    const isMixedRoute = allowedRoles.includes("user") && allowedRoles.includes("admin");

    if (isMixedRoute) {
        currentUser = user || admin;
        isLoading = userLoading || adminLoading;
    } else if (allowedRoles.includes("admin")) {
        currentUser = admin;
        isLoading = adminLoading;
    } else {
        currentUser = user;
        isLoading = userLoading;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        if (allowedRoles.includes("admin") && !allowedRoles.includes("user")) {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/auth/login" replace />;
    }

    // Role check (for mixed role routes if any)
    const resolvedRole = currentUser.role || (currentUser === admin ? "admin" : "user");
    if (!allowedRoles.includes(resolvedRole)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
