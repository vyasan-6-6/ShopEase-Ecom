import { memo, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/authSchema";
import { loginUser, resendOtp, setVerificationFlow } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading } from "../../redux/features/auth/authSelectors";
import Button from "../common/Button";

const UNVERIFIED_MSG = "Please verify your account with OTP.";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const [formError, setFormError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });
    //yup → defines rules
    //resolver → connects yup to react-hook-form
    //react-hook-form → manages form state

    const onSubmit = useCallback(
        async (data) => {
            setFormError(""); // clear previous error
            const actionResult = await dispatch(loginUser(data));

            if (loginUser.rejected.match(actionResult)) {
                const errorMsg = actionResult.payload;

                if (errorMsg === UNVERIFIED_MSG) {
                    // Unverified account → resend OTP and redirect to OTP screen
                    dispatch(setVerificationFlow(data.email));
                    dispatch(resendOtp(data.email));
                    navigate("/auth/register");
                } else {
                    // Wrong password or any other login error → show inline in form
                    setFormError(errorMsg || "Login failed. Please try again.");
                }
            }
        },
        [dispatch, navigate]
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="Enter your email"
            />
            <Input
                label="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                placeholder="Enter your password"
            />

            {/* Inline server error — shown only when login fails */}
            {formError && (
                <div className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-100 rounded-2xl">
                    <span className="text-red-500 mt-0.5">⚠</span>
                    <p className="text-sm font-medium text-red-600">{formError}</p>
                </div>
            )}

            <Button type="submit" loading={loading} fullWidth>
                Login
            </Button>
            <div className="flex justify-between text-sm mt-4">
                <Link to="/auth/forgot-password" className="text-blue-600">
                    Forgot Password?
                </Link>

                <Link to="/auth/register" className="text-blue-600">
                    Create Account
                </Link>
            </div>
        </form>
    );
};

export default memo(LoginForm);
