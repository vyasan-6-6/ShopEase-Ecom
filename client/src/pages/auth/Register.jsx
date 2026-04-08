import { registerUser, resendOtp, tickRegisterCooldown, verifyOtp } from "../../redux/features/auth/authSlice";
import {
    selectAuthError,
    selectAuthLoading,
    selectRegisterFlow,
    selectUser,
} from "../../redux/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import OtpInput from "../../components/common/OtpInput";
const Register = memo(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const { email, cooldown, step } = useAppSelector(selectRegisterFlow)
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);
    const user = useAppSelector(selectUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [otp, setOtp] = useState("");

    const onSubmit = useCallback(
        (data) => {
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            dispatch(
                registerUser({ name: `${data.firstName} ${data.lastName}`, email: data.email, password: data.password }),
            );
        },
        [dispatch],
    );
    const handleVerify = useCallback(() => {
        dispatch(verifyOtp({ email, otp }));
        navigate("/auth/login");
    }, [dispatch, email, otp]);

    const handleResent = useCallback(() => {
        if (cooldown > 0) return;
        dispatch(resendOtp(email));
    }, [dispatch, cooldown, email]);
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp, handleVerify]);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                dispatch(tickRegisterCooldown());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [cooldown, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    useEffect(() => {
        if (cooldown === 60) {
            toast.success("OTP reset successfull");
        }
    }, [cooldown]);

    return (
        <AuthLayout>
            <div>
                {step === "form" && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label={"FirstName"}
                            type="text"
                            {...register("firstName", { required: "First name is required" })}
                            error={errors.firstName?.message}
                            placeholder="First Name"
                        />
                        <Input
                            label={"LastName"}
                            type="text"
                            {...register("lastName", { required: "Last name is required" })}
                            error={errors.lastName?.message}
                            placeholder="Last Name"
                        />
                        <Input
                            label={"Email"}
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email",
                                },
                            })}
                            error={errors.email?.message}
                            placeholder="Email"
                        />
                        <Input
                            label={"Password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters" },
                            })}
                            error={errors.password?.message}
                            type="password"
                            placeholder="Password"
                        />
                        <Input
                            label={"Confirm Password"}
                            {...register("confirmPassword", { required: "Confrim your password" })}
                            error={errors.confirmPassword?.message}
                            type="password"
                            placeholder="Confirm Password"
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Sending OTP..." : "Register"}
                        </Button>
                    </form>
                )}
                {step === "otp" && (
                    <div className="space-y-4 text-center">
                        <OtpInput value={otp} onChange={setOtp} />

                        <Button onClick={handleVerify} disabled={loading || otp.length !== 6} fullWidth>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>

                        <Button disabled={cooldown > 0 || loading} fullWidth variant="outline" onClick={handleResent}>
                            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                        </Button>
                    </div>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </AuthLayout>
    );
});
Register.displayName = "Register";
export default Register;
