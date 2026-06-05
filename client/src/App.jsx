import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getProfile } from "./redux/features/auth/authSlice";
import { getAdminProfile } from "./redux/features/auth/adminAuthSlice";
import { useAppDispatch } from "./redux/hooks";
import { useEffect, useState, lazy, Suspense } from "react";
import { AUTH_CONFIG } from "./config/app";
import ScrollToTop from "./components/common/ScrollToTop";

// Lazy Loaded Route Modules
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const UserRoutes = lazy(() => import("./routes/UserRoutes"));
const PublicRoutes = lazy(() => import("./routes/PublicRoutes"));

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
            <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading page...</p>
        </div>
    </div>
);

import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "./components/common/GlobalErrorFallback";

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
            <ErrorBoundary 
                FallbackComponent={GlobalErrorFallback}
                onReset={() => {
                    // This runs when the user clicks "Try Again"
                    // We can reset state or simply reload the page as a brute-force reset
                    window.location.reload();
                }}
            >
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* 
                          Descendant routing:
                          Any path starting with /admin will be handled by AdminRoutes 
                        */}
                        <Route path="/admin/*" element={<AdminRoutes />} />
                        
                        {/* Any path starting with /user will be handled by UserRoutes */}
                        <Route path="/user/*" element={<UserRoutes />} />
                        
                        {/* Everything else (like /, /auth/login, etc.) goes to PublicRoutes */}
                        <Route path="/*" element={<PublicRoutes />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
            <ToastContainer position="top-right" autoClose={1000} />
        </BrowserRouter>
    );
}

export default App;
