import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLoading, selectUser } from "../../redux/features/auth/authSelectors";
import { loginAdmin } from "../../redux/features/auth/authSlice";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
 const AdminLogin = memo(() => {
const dispatch  = useAppDispatch();

const navigate = useNavigate()
const loading = useSelector(selectAuthLoading);
const admin = useSelector(selectUser);
 const [serverErrors, setServerErrors] = useState({});
    const {register,handleSubmit,formState:{errors}} = useForm();

const onSubmit = async (data) => {
    setServerErrors({});

    try {
        const actionResult = await dispatch(loginAdmin(data));
        
            if (loginAdmin.rejected.match(actionResult)) {
                const errorMsg = actionResult.payload;
                console.log("errorMsg",errorMsg);
                
                const lowerMsg = (errorMsg || "").toLowerCase();
                 
                const newErrors = {};

                if (lowerMsg.includes("email") || lowerMsg.includes("admin") || lowerMsg.includes("not found")) {
                    newErrors.email = errorMsg;
                }
                
                if (lowerMsg.includes("password") || lowerMsg.includes("credential")) {
                    newErrors.password = errorMsg;
                }

                if (Object.keys(newErrors).length > 0) {
                    setServerErrors(newErrors);
                } else {
                    toast.error(errorMsg || "Login failed. Please try again.");
                }
            }
        
    } catch (error) {
        toast.error(error.message || "Admin Login failed. Please try again.");
    }
};

useEffect(()=>{
    if(admin?.role==='admin'){
        navigate("/admin/dashboard")
    }
},[navigate,admin])
    return (
    <AuthLayout title={`Admin Portal`} subtitle={`Sign in to access the dashboard`}>
        <div className="mt-10 mb-6">
            <Button 
                variant="outline" 
                fullWidth
                onClick={() => navigate("/auth/login")}
            >
                Back to User Login
            </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
             <Input
          label="Admin Email" 
          type="email"
          {...register("email",{required:"Email is required"})} 
          error={errors.email?.message || serverErrors.email}
        />
          <Input
          label="Password" 
          type="password"
          {...register("password",{required:"Password is required"})}  
          error={errors.password?.message || serverErrors.password}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Admin Login"}
        </Button>
        </form>
    </AuthLayout>
   )
 });
 
AdminLogin.displayName = "AdminLogin";
 
 export default AdminLogin