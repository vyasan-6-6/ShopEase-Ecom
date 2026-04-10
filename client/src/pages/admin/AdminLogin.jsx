import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectAdminLoading, selectAdminUser } from "../../redux/features/admin/adminSelector";
import { loginAdmin } from "../../redux/features/admin/adminSlice";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
 const AdminLogin = memo(() => {
const dispatch  = useAppDispatch();

const navigate = useNavigate()
const loading = useSelector(selectAdminLoading);
const admin = useSelector(selectAdminUser);
    const {register,handleSubmit,setError,formState:{errors}} = useForm();

const onSubmit = async (data) => {
    const actionResult = await dispatch(loginAdmin(data));

    if (loginAdmin.rejected.match(actionResult)) {
        const errorMsg = actionResult.payload;
        const lowerMsg = (errorMsg || "").toLowerCase();
        
        // Let's see which fields we need to flag
        let errorSet = false;
        
        if (lowerMsg.includes("email") || lowerMsg.includes("user") || lowerMsg.includes("not found")) {
            setError("email", { type: "server", message: errorMsg });
            errorSet = true;
        } 
        
        if (lowerMsg.includes("password") || lowerMsg.includes("credential")) {
            setError("password", { type: "server", message: errorMsg });
            errorSet = true;
        } 
        
        // Fallback to toast if no fields were matched
        if (!errorSet) {
            toast.error(errorMsg || "Admin Login failed. Please try again.");
        }
    }
}

useEffect(()=>{
    if(admin?.role==='admin'){
        navigate("/admin/dashboard")
    }
},[navigate,admin]);
    return (
    <AuthLayout title={`Admin Portal`} subtitle={`Sign in to access the dashboard`}>
        <form onSubmit={handleSubmit(onSubmit)}>
             <Input
          label="Admin Email" 
          type="email"
          {...register("email",{required:"Email is required"})} 
          error={errors.email?.message}
        />
          <Input
          label="Password" 
          type="password"
          {...register("password",{required:"Password is required"})}  
          error={errors.password?.message}
        
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