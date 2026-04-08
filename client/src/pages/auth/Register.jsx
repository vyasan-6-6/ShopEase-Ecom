import { selectUser } from "../../redux/features/auth/authSelectors";
import { useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
const Register = memo(() => {
    const navigate = useNavigate();

    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
});
Register.displayName = "Register";
export default Register;
