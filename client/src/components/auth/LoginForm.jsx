import { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/authSchema";
import { loginUser, resendOtp, setVerificationFlow } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading } from "../../redux/features/auth/authSelectors";
import Button from "../common/Button";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
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
            // We await the dispatch to inspect the result
            const actionResult = await dispatch(loginUser(data));
            console.log("daat:", data.email);

            // If the login was rejected...
            if (loginUser.rejected.match(actionResult)) {
                // And the error is specifically the unverified account error...
                if (actionResult.payload === "Please verify your account with OTP.") {
                    dispatch(setVerificationFlow(data.email)); // Setup the Redux state
                    dispatch(resendOtp(data.email)); // Ask the backend to text them!
                    navigate("/auth/register"); // Push them to the screen with the OTP Input
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
