import { useForm } from "react-hook-form"
import { useAppDispatch } from "../../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectAdminLoading, selectAdminUser } from "../../redux/features/admin/adminSelector";
import { loginAdmin } from "../../redux/features/admin/adminSlice";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
 const AdminLogin = memo(() => {
const dispatch  = useAppDispatch();

const navigate = useNavigate()
const loading = useSelector(selectAdminLoading);
const admin = useSelector(selectAdminUser);
    const {register,handleSubmit,formState:{errors}} = useForm();
const onSubmit = (data)=>{
    dispatch(loginAdmin(data));
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