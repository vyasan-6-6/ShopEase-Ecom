import { selectAuthError, selectUser } from "../../redux/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { clearError } from "../../redux/features/auth/authSlice";

const Login = memo(() => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const error = useAppSelector(selectAuthError);
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            navigate("/user/dashboard");
        }
    }, [navigate, user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError()); // <--- Add this! Now it clears out instantly!
        }
    }, [error, dispatch]);

    return (
        <AuthLayout title={`User Portal`} subtitle={`New Here. Sign in  `}>
            <LoginForm />
        </AuthLayout>
    );
});
Login.displayName = "Login";
export default Login;
