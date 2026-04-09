import { selectUser } from "../../redux/features/auth/authSelectors";
import { useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const Login = memo(() => {
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            navigate("/user/dashboard");
        }
    }, [navigate, user]);

    return (
        <AuthLayout title="Login" subtitle="Welcome back! Sign in to your account">
            <LoginForm />
        </AuthLayout>
    );
});

Login.displayName = "Login";
export default Login;

