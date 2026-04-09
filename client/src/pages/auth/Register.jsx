import { selectUser, selectRegisterFlow } from "../../redux/features/auth/authSelectors";
import { useAppSelector } from "../../redux/hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = memo(() => {
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const { step } = useAppSelector(selectRegisterFlow);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const isOtpStep = step === "otp";

    return (
        <AuthLayout
            title={isOtpStep ? "Verify OTP" : "Register"}
            subtitle={isOtpStep ? "Enter the 6-digit code sent to your email" : "New here? Sign up to create an account"}
        >
            <RegisterForm />
        </AuthLayout>
    );
});

Register.displayName = "Register";
export default Register;

