import {
    forgotPassword,
    registerUser,
    resentOtp,
    resetPassword,
    setUser,
    tickCooldown,
    verifyOtp,
    verifyResetOtp,
} from "../../redux/features/auth/authSlice";
import {
    selectAuthEmail,
    selectAuthError,
    selectAuthLoading,
    selectAuthStep,
    selectCooldown,
    selectUser,
} from "../../redux/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import OtpInput from "../../components/ui/OtpInput";

const ForgotPassword = () => {
    const dispatch = useAppDispatch();

    const step = useAppSelector(selectAuthStep);
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);
    const email = useAppSelector(selectAuthEmail);
    const cooldown = useAppSelector(selectCooldown);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = useCallback(
        (data) => {
            dispatch(forgotPassword(data.email));
        },
        [dispatch],
    );

    const handleVerify = useCallback(() => {
        dispatch(verifyResetOtp({ email, otp }));
    }, [dispatch, otp, email]);

    const handleReset = useCallback(() => {
        dispatch(resetPassword({ email, password }));
    }, [dispatch, email, password]);

    const handleResent = useCallback(() => {
        if (cooldown > 0) return;
        dispatch(resentOtp(email));
    }, [dispatch, cooldown, email]);

    useEffect(() => {
        if (cooldown > 0) {
            const t = setInterval(() => {
                dispatch(tickCooldown());
            }, 1000);
            return () => clearInterval(t);
        }
    }, [cooldown, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <AuthLayout title={`Forgot Password`}>
            {/* STEP 1 */}
            {step === "forgot" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        register={register}
                        rules={{ required: "Email required" }}
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

                    <Button onClick={handleVerify} disabled={otp.length !== 6 || loading} fullWidth>
                        Verify OTP
                    </Button>

                    <Button disabled={cooldown > 0} variant="outline" fullWidth onClick={handleResent}>
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
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
                    <p>Password updated successfully</p>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
