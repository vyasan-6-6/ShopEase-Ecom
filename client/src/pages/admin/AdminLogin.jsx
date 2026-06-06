import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAdminLoading, selectAdmin } from "../../redux/features/auth/adminAuthSelectors";
import { loginAdmin } from "../../redux/features/auth/adminAuthSlice";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
 const AdminLogin = memo(() => {
const dispatch  = useAppDispatch();

const navigate = useNavigate()
const loading = useAppSelector(selectAdminLoading);
const admin = useAppSelector(selectAdmin);
    const {register,handleSubmit,setError,formState:{errors}} = useForm();

const onSubmit = async (data) => {

    try {
        const actionResult = await dispatch(loginAdmin(data));
        
            if (loginAdmin.rejected.match(actionResult)) {
                const errorMsg = actionResult.payload;
                console.log("errorMsg",errorMsg);
                
                const lowerMsg = (errorMsg || "").toLowerCase();
                 
                if (lowerMsg.includes("email") || lowerMsg.includes("admin") || lowerMsg.includes("not found")) {
                    setError("email", { type: "server", message: errorMsg });
                }
                
                if (lowerMsg.includes("password") || lowerMsg.includes("credential")) {
                    setError("password", { type: "server", message: errorMsg });
                }

                toast.error(errorMsg || "Login failed. Please try again.");
            }
        
    } catch (error) {
        toast.error(error.message || "Admin Login failed. Please try again.");
    }
};

useEffect(()=>{
    if(admin){
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
             <Input
          label="Admin Email" 
          type="email"
          placeholder="Enter your email"
          {...register("email",{required:"Email is required"})} 
          error={errors.email?.message}
        />
          <Input
          label="Password" 
          type="password"
          placeholder="Enter your password"
          {...register("password",{required:"Password is required"})}  
          error={errors.password?.message}
        />
        <div className="pt-2">
            <Button fullWidth type="submit" disabled={loading} loading={loading}>
              {loading ? "Logging in..." : "Admin Login"}
            </Button>
        </div>
          <div className="text-center">
    <p className="text-sm text-gray-500 font-medium">
      Not an admin?{" "}
      <button 
      type="button"
        onClick={() => navigate("/auth/login")}
        className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all"
      >
        Login as user
      </button>
    </p>
  </div>
        </form>
    </AuthLayout>
   )
 });
 
AdminLogin.displayName = "AdminLogin";
 
 export default AdminLogin