import { registerUser, resentOtp, tickCooldown, verifyOtp } from "../../redux/features/auth/authSlice";
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
const Register = memo(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const step = useAppSelector(selectAuthStep);
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);
    const email = useAppSelector(selectAuthEmail);
    const cooldown = useAppSelector(selectCooldown);
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
    }, [dispatch]);

    const handleResent = useCallback(() => {
        if (cooldown > 0) return;
        dispatch(resentOtp(email));
    });
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                dispatch(tickCooldown());
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
        <AuthLayout  >
            <div>
                {step === "form" && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label={"FirstName"}
                            name={"name"}
                            type="text"
                            register={register}
                            error={errors.name?.message}
                            rules={{ required: "First name is required" }}
                            placeholder="First Name"
                        />
                        <Input
                            label={"Last Name"}
                            name={"lastName"}
                            type="text"
                            register={register}
                            error={errors.lastName?.message}
                            rules={{ required: "Last name is required" }}
                            placeholder="Last Name"
                        />
                        <Input
                            name={"email"}
                            label={"Email"}
                            type="email"
                            register={register}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email",
                                },
                            }}
                            error={errors.email?.message}
                            placeholder="Email"
                        />
                        <Input
                            name={"password"}
                            label={"Password"}
                            register={register}
                            error={errors.password?.message}
                            type="password"
                            rules={{
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters" },
                            }}
                            placeholder="Password"
                        />
                        <Input
                            name={"confirmPassword"}
                            label={"Confirm Password"}
                            register={register}
                            error={errors.confirmPassword?.message}
                            type="password"
                            rules={{ required: "Confirm your password" }}
                            placeholder="Confirm Password"
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Sending OTP..." : "Register"}
                        </Button>
                    </form>
                )}
                {step === "otp" && (
                    <div>
                        <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />;
                        <Button onClick={handleVerify} disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"};
                        </Button>{" "}
                        <br />
                        <Button disabled={cooldown > 0 || loading} fullWidth variant="outline" onClick={handleResent}>
                            {cooldown > 0 ? `Resent OTP in ${cooldown}s ` : "Resent OTP"}
                        </Button>
                    </div>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </AuthLayout>
    );
});

export default Register;
