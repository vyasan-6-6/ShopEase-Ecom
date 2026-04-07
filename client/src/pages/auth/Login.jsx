import { loginUser} from "../../redux/features/auth/authSlice";
import { selectAuthError, selectAuthLoading, selectUser } from "../../redux/features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import { memo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button"; 

const Login = memo(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthLoading);
    const user = useAppSelector(selectUser);

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



    useEffect(() => {
        console.log("user inlogin page:",user);
        
        if (user) {
            navigate("/user/dashboard");
        }
    }, [navigate, user]);

    
     

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);


    return (
        <AuthLayout title={`User Portal`} subtitle={`New Here. Sign in  `}>
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
        </AuthLayout>
    );
});
Login.displayName = "Login";
export default Login;
