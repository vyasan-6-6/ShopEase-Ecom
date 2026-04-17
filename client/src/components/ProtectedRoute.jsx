import { Navigate, Outlet } from "react-router-dom";
import { selectAuthLoading, selectUser } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";

// Accepts an array of allowed roles, e.g., ["admin"] or ["user"]
const ProtectedRoute = ({ allowedRoles = ["user"] }) => {
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);

    // 2. Show loading spinner if fetching
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // 4. If nobody is logged in, redirect them to the correct login page!
    if (!user) {
        if (allowedRoles.includes("admin")) {
            return <Navigate to={`/admin/login`} replace />;
        }
        return <Navigate to={`/auth/login`} replace />;
    }

    // 5. If they are logged in, but their role doesn't match the route allowedRoles
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Boot them back to the home page
    }

    // 6. Security passed! Render the protected pages inside
    return <Outlet />;
};

export default ProtectedRoute;
