import { memo, useCallback } from "react"
import { Link } from "react-router-dom";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import { loginUser } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading } from "../../redux/features/auth/authSelectors";
import Button from "../common/Button";

const LoginForm = ()=>{

    
        const dispatch = useAppDispatch();
        const loading = useAppSelector(selectAuthLoading);
    const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm();
    
        const onSubmit = useCallback(
            (data) => {
                dispatch(loginUser(data));
            },
            [dispatch],
        );
    return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                    error={errors.email?.message}
                    placeholder="Enter your email"
                />
                <Input
                    label="Password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    error={errors.password?.message}
                    placeholder="Enter your password"
                />
                <Button type="submit" loading={loading} fullWidth>
                    Login
                </Button> 
                <div className="flex justify-between text-sm mt-4">
                    <Link to="/auth/forgot-password" className="text-blue-600"  >
                        Forgot Password?
                    </Link>

                    <Link to="/auth/register" className="text-blue-600">
                        Create Account
                    </Link>
                </div>
            </form>
    )
}

export default memo(LoginForm);