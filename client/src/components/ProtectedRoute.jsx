import { Navigate, Outlet } from "react-router-dom";
import { selectAuthLoading, selectUser } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";

 
const ProtectedRoute = () => {
    const user  = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);
    if(loading){
       return <div>Loading...</div>;
    }
    if(!user){
        return <Navigate to={`/auth/login`} replace/>
    }
  return <Outlet/>
}

export default ProtectedRoute;