import { memo, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/authSchema";
import { loginUser, resendOtp, setVerificationFlow } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading } from "../../redux/features/auth/authSelectors";
import Button from "../common/Button";
import { fetchCart, mergeUserCart } from "../../redux/features/cart/cartSlice";

const UNVERIFIED_MSG = "Please verify your account with OTP.";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);


    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = useCallback(
        async (data, e) => {

            if (e) e.preventDefault();

            try {
                const trimmedData = {
                    email: data.email?.trim(),
                    password: data.password?.trim(),
                };
                const actionResult = await dispatch(loginUser(trimmedData));


                if (loginUser.rejected.match(actionResult)) {
                    const errorMsg = actionResult.payload;

                    if (errorMsg === UNVERIFIED_MSG) {
                        dispatch(setVerificationFlow(data.email));
                        dispatch(resendOtp(data.email));
                        navigate("/auth/register");
                    } else {
                        const lowerMsg = (errorMsg || "").toLowerCase();

                        if (lowerMsg.includes("email") || lowerMsg.includes("user") || lowerMsg.includes("not found")) {
                            setError("email", { type: "server", message: errorMsg });
                        }

                        if (lowerMsg.includes("password") || lowerMsg.includes("credential")) {
                            setError("password", { type: "server", message: errorMsg });
                        }

                        toast.error(errorMsg || "Login failed. Please try again.");
                    }
                }
                const localItems = JSON.parse(window.localStorage.getItem("cartItems")) || []
                if (localItems.length > 0) {
                    dispatch(mergeUserCart(localItems)).unwrap();
                } else {
                    dispatch(fetchCart())
                }
            } catch (err) {
                console.error("Unhandled error in onSubmit:", err);
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
