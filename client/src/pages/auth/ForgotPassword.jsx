import {
    forgotPassword,
    resendOtp,
    resetPassword,
    tickForgotCooldown,
    verifyResetOtp,
    resetForgotFlow,
} from "../../redux/features/auth/authSlice";
import {
    selectAuthError,
    selectAuthLoading,
    selectForgotFlow,
} from "../../redux/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../utils/authSchema";
import { memo, useCallback, useEffect, useState } from "react"; 
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import OtpInput from "../../components/common/OtpInput";
import { useNavigate } from "react-router-dom";

const ForgotPassword = memo(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {email,cooldown,step}  = useAppSelector(selectForgotFlow)
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading); 

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: "onChange",
    });

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = useCallback(
        async (data) => {
            const result = await dispatch(forgotPassword(data.email));
            if (forgotPassword.fulfilled.match(result)) {
                toast.success("OTP sent to your email!");
            }
        },
        [dispatch],
    );

    const handleVerify = useCallback(async () => {
        const result = await dispatch(verifyResetOtp({ email, otp }));
        if (verifyResetOtp.fulfilled.match(result)) {
            toast.success("OTP verified! Set your new password.");
        }
    }, [dispatch, otp, email]);

    const handleReset = useCallback(async () => {
        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        const result = await dispatch(resetPassword({ email, newPassword: password }));
        if (resetPassword.fulfilled.match(result)) {
            toast.success("Password reset successful!");
        }
    }, [dispatch, email, password]);

    const handleResent = useCallback(async () => {
        if (cooldown > 0) return;
        const result = await dispatch(resendOtp(email));
        if (resendOtp.fulfilled.match(result)) {
            toast.success("OTP resent successfully!");
        }
    }, [dispatch, cooldown, email]);

useEffect(() => {
    if (cooldown > 0) {
        const t = setInterval(() => {
            dispatch(tickForgotCooldown());
        }, 1000);
        return () => clearInterval(t);
    }
}, [cooldown, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (step === "done") {
            const timer = setTimeout(() => {
                navigate("/", { replace: true });
                dispatch(resetForgotFlow());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, navigate, dispatch]);

    // Cleanup on unmount to ensure the flow starts fresh next time
    useEffect(() => {
        return () => {
            // Only reset if we are NOT in the finished state (otherwise the timer handle it)
            // Actually, safety reset is better
            dispatch(resetForgotFlow());
        };
    }, [dispatch]);

    return (
        <AuthLayout title={`Forgot Password`}>
            {/* STEP 1 */}
            {step === "email" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        placeholder="Enter Email"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Button type="submit" loading={loading} fullWidth>
                        Send OTP
                    </Button>
                </form>
            )}

            {/* STEP 2 */}
            {step === "otp" && (
                <div className="space-y-4">
                    <OtpInput value={otp} onChange={setOtp} />

                    <Button onClick={handleVerify} disabled={otp.length !== 6 || loading} fullWidth >
                        Verify OTP
                    </Button>

                    <Button disabled={cooldown > 0} variant="outline" fullWidth onClick={handleResent}>
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </Button>

                    <Button 
                        disabled={loading} 
                        fullWidth 
                        variant="text" 
                        onClick={() => dispatch(resetForgotFlow())}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        Cancel & Return
                    </Button>
                </div>
            )}
            {step === "reset" && (
                <div className="space-y-4">
                    <Input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button onClick={handleReset} loading={loading} fullWidth>
                        Reset Password
                    </Button>
                </div>
            )}

            {/* STEP 4 */}
            {step === "done" && (
                <div className="text-center space-y-2">
                    <p className="text-green-600 font-medium">Password updated successfully!</p>
                    <p className="text-sm text-gray-500">Redirecting to home page in 3 seconds...</p>
                </div>
            )}
        </AuthLayout>
    );
});
forgotPassword.displayName = "forgotPassword";
export default ForgotPassword;
