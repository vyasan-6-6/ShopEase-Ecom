import { selectUser } from "../../redux/features/auth/authSelectors";
import { useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import Button from "../../components/common/Button";

const Login = memo(() => {
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [navigate, user]);

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

