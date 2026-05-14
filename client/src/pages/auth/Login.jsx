import { selectUser } from "../../redux/features/auth/authSelectors";
import { useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import Button from "../../components/common/Button";

const Login = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            const searchParams = new URLSearchParams(location.search);
            const redirectPath = searchParams.get("redirect") || "/";
            navigate(redirectPath, { replace: true });
        }
    }, [navigate, user, location.search]);

    return (
        <AuthLayout title="Login" subtitle="Welcome back! Sign in to your account">
            <div className="mt-10 mb-6">
                <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => navigate("/admin/login")}
                >
                    Login as Admin
                </Button>
            </div>
            <LoginForm />
        </AuthLayout>
    );
});

Login.displayName = "Login";
export default Login;

