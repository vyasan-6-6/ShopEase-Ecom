import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/authSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Input from "../common/Input";

import { clearError, registerUser, resendOtp, tickRegisterCooldown, verifyOtp } from "../../redux/features/auth/authSlice";

import { selectAuthError, selectAuthLoading, selectRegisterFlow } from "../../redux/features/auth/authSelectors";

import OtpInput from "../common/OtpInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Button from "../common/Button";

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { email, cooldown, step } = useAppSelector(selectRegisterFlow);
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onChange",//By setting this to "onChange", the form checks the rules every time the user types a single character.
    });

    const [otp, setOtp] = useState("");

    const onSubmit = useCallback(
        (data) => {
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
        dispatch(clearError()); // <--- Add this! Now it clears out instantly!
    }
}, [error, dispatch]);

    useEffect(() => {
        if (cooldown === 60) {
            toast.success("OTP reset successfull");
        }
    }, [cooldown]);

    return (
        <div>
            {step === "form" && (
                <form onSubmit={handleSubmit(onSubmit)}>
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
    );
};

export default memo(RegisterForm);
