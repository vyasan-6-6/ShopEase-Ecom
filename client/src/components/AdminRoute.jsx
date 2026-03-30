import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";

 
const AdminRoute = () => {
    const user = useAppSelector(selectUser);
    if(!user){
        return <Navigate to={`/auth/login`} replace/>
    }
    if(user.role!=="admin"){
return <Navigate to={`/`} replace/>
    }
  return  <Outlet/>
}

export default AdminRoute;