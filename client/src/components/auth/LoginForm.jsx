import { memo, useCallback, useEffect, useState } from "react";
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

const UNVERIFIED_MSG = "Please verify your account with OTP.";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);


    const [serverErrors, setServerErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = useCallback(
        async (data, e) => {
            console.log("LOGIN SUBMITTED", data);
            if (e) e.preventDefault();
            
            // Clear any previous server errors before submitting
            setServerErrors({});
            
            try {
                const actionResult = await dispatch(loginUser(data));

                if (loginUser.rejected.match(actionResult)) {
                    const errorMsg = actionResult.payload;

                    if (errorMsg === UNVERIFIED_MSG) {
                        dispatch(setVerificationFlow(data.email));
                        dispatch(resendOtp(data.email));
                        navigate("/auth/register");
                    } else {
                        const lowerMsg = (errorMsg || "").toLowerCase();
                        
                        // Pass errors exactly where they belong natively 
                        const newErrors = {};//usecase of newErrors is to store the errors in the form of key-value pairs so that we can display them in the form of error messages
                        
                        if (lowerMsg.includes("email") || lowerMsg.includes("user") || lowerMsg.includes("not found")) {
                            newErrors.email = errorMsg;
                        }
                        
                        if (lowerMsg.includes("password") || lowerMsg.includes("credential")) {
                            newErrors.password = errorMsg;
                        }

                        // If the backend sent a generic "Invalid email or password", both fields will be populated!
                        if (Object.keys(newErrors).length > 0) {
                            setServerErrors(newErrors);
                        } else {
                            toast.error(errorMsg || "Login failed. Please try again.");
                        }
                    }
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
                {...register("email", {
                    onChange: () => {
                        if (serverErrors.email) setServerErrors(prev => ({ ...prev, email: "" }));//onchange event is triggered when the value of the input field changes.so when the user starts typing the email, the error message will be cleared.
                    }
                })}
                error={errors.email?.message || serverErrors.email}
                placeholder="Enter your email"
            />
            <Input
                label="Password"
                type="password"
                {...register("password", {
                    onChange: () => {
                        if (serverErrors.password) setServerErrors(prev => ({ ...prev, password: "" }));
                    }
                })}
                error={errors.password?.message || serverErrors.password}
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
