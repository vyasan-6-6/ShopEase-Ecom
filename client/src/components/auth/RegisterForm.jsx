import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/authSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Input from "../common/Input";

import { logout, registerUser, resendOtp, tickRegisterCooldown, verifyOtp } from "../../redux/features/auth/authSlice";

import { selectAuthLoading, selectRegisterFlow } from "../../redux/features/auth/authSelectors";

import OtpInput from "../common/OtpInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Button from "../common/Button";

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { email, cooldown, step } = useAppSelector(selectRegisterFlow);
    const loading = useAppSelector(selectAuthLoading);
    
    const {
        register,
        handleSubmit, 
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onChange",
    });
    
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const onSubmit = useCallback(
        async (data) => {
            const trimmedData = {
                firstName: data.firstName?.trim(),
                lastName: data.lastName?.trim(),
                email: data.email?.trim(),
                password: data.password // Passwords are trimmed by backend validation, but let's be explicit if desired
            };

            const result = await dispatch(
                registerUser({ 
                    name: `${trimmedData.firstName} ${trimmedData.lastName}`, 
                    email: trimmedData.email, 
                    password: data.password?.trim() // Trimming password on frontend too
                }),
            );
            
            if (registerUser.rejected.match(result)) { 
                const errorMsg = result.payload || "Registration failed";
                const lowerMsg = errorMsg.toLowerCase();
                
                // Intelligently route backend errors to the appropriate input fields
                if (lowerMsg.includes("email") || lowerMsg.includes("user") || lowerMsg.includes("exist")) {
                    setError("email", { type: "server", message: errorMsg });
                } 
                if (lowerMsg.includes("password")) {
                    setError("password", { type: "server", message: errorMsg });
                }
                if (lowerMsg.includes("name")) {
                    setError("firstName", { type: "server", message: errorMsg });
                    setError("lastName", { type: "server", message: errorMsg });
                }

                toast.error(errorMsg);
            }
        },
        [dispatch],
    );

    const handleVerify = useCallback(async (e) => {
        if (e) e.preventDefault();//usecase of preventDefault is to prevent the default behavior of the event like form submission or link navigation, let me explain you in detail, when we click on the button, it will trigger the event, and the event will have a default behavior, which is to submit the form, but we don't want to submit the form, we want to submit the form manually, so we prevent the default behavior of the event, and then we submit the form manually
         

        setOtpError("");
        const result = await dispatch(verifyOtp({ email, otp }));
        
        if (verifyOtp.fulfilled.match(result)) {
            toast.success("Account verified successfully!");
            navigate("/auth/login");
        } else if (verifyOtp.rejected.match(result)) {
            const errorMsg = result.payload || "OTP verification failed";
            
            // Clear input and show error briefly for a better UX
            setOtp("");
            setOtpError(errorMsg);
            
            setTimeout(() => {
                setOtpError("");
            }, 3000);

            // If it's a critical error not related to the code itself, show a toast
            if (!errorMsg.includes("Invalid") && !errorMsg.includes("OTP")) {
                toast.error(errorMsg);
            }
        }
    }, [dispatch, email, otp, navigate, loading]);

    const handleResent = useCallback(async (e) => {
        if (e) e.preventDefault();
        if (loading) return;


        if (cooldown > 0) return;
        const result = await dispatch(resendOtp(email));
        if (resendOtp.fulfilled.match(result)) {
            toast.success("OTP resent successfully!");
        } else if (resendOtp.rejected.match(result)) {
            toast.error(result.payload || "Failed to resend OTP");
        }
    }, [dispatch, cooldown, email, loading]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                dispatch(tickRegisterCooldown());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [cooldown, dispatch]);

    useEffect(() => {
        if (cooldown === 60) {
            toast.success("OTP reset successfull");
        }
    }, [cooldown]);

    // Removed the frontend 10-minute auto-logout timer because it didn't reset
    // when 'Resend OTP' was clicked. The backend already validates OTP expiration.



    return (
        <div className="space-y-4">
            {step === "form" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label={"FirstName"}
                        type="text"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                        placeholder="First Name"
                    />
                    <Input
                        label={"LastName"}
                        type="text"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                        placeholder="Last Name"
                    />
                    <Input
                        label={"Email"}
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        placeholder="Email"
                    />
                    <Input
                        label={"Password"}
                        {...register("password")}
                        error={errors.password?.message}
                        type="password"
                        placeholder="Password"
                    />
                    <Input
                        label={"Confirm Password"}
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        type="password"
                        placeholder="Confirm Password"
                    />



                    <Button type="submit" disabled={loading} fullWidth>
                        {loading ? "Sending OTP..." : "Register"}
                    </Button>
                </form>
            )}
            {step === "otp" && (
                <div className="space-y-4 text-center">
                    <OtpInput value={otp} onChange={(val) => { setOtp(val); setOtpError(""); }} error={otpError} />


                    <Button onClick={handleVerify} disabled={loading || otp.length !== 6} fullWidth>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <Button disabled={cooldown > 0 || loading} fullWidth variant="outline" onClick={handleResent}>
                        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                    </Button>

                    <Button 
                        disabled={loading} 
                        fullWidth 
                        variant="text" 
                        onClick={() => dispatch(logout())}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        Cancel & Return
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(RegisterForm);
