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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const step = useAppSelector(selectAuthStep);
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);
    const email = useAppSelector(selectAuthEmail);
    const cooldown = useAppSelector(selectCooldown);
    const user = useAppSelector(selectUser);

    const { register, handleSubmit } = useForm();
    const [otp, setOtp] = useState("");

    const onSubmit = (data) => {
        if (data.password !== data.confirmPassword) return;
        dispatch(registerUser({ name: `${data.firstName} ${data.lastName}`, email: data.email, password: data.password }));
    };
    const handleVerify = () => {
        dispatch(verifyOtp({ email, otp }));
    };

    const handleResent =()=>{
        if(cooldown>0) return;
        dispatch(resentOtp(email))
    }
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
        <div>
            {step === "form" && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("firstName")} placeholder="First Name" />
                    <input {...register("lasttName")} placeholder="Last Name" />
                    <input {...register("email")} placeholder="Email" />
                    <input type="password" {...register("password")} placeholder="Password" />
                    <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending OTP..." : "Register"}
                    </button>
                </form>
            )}
            {step === "otp" && (
                <div>
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />;
                    <button onSubmit={handleVerify}   disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"};
                    </button> <br />
                    <button type="submit" disabled={cooldown > 0}>
                        {cooldown > 0 ? `Resent OTP in ${cooldown}s` : "Resent OTP"};
                    </button><br />
                    <button disabled={cooldown>0 || loading}  onClick={handleResent}>
                        {cooldown >0 ? `Resent in ${cooldown}s `:"Resent OTP"}
                    </button>
                </div>
            )}
            ;{error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Register;
