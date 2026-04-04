import { Navigate, Outlet } from "react-router-dom";
import { selectAuthLoading, selectUser } from "../redux/features/auth/authSelectors";
import { useAppSelector } from "../redux/hooks";
import { selectAdminLoading, selectAdminUser } from "../redux/features/admin/adminSelector";

 // Accepts an array of allowed roles, e.g., ["admin"] or ["user"]
const ProtectedRoute = ({allowedRoles=["user"]}) => {
    const normalUser  = useAppSelector(selectUser);
    const adminUser  = useAppSelector(selectAdminUser);
    
    const userLoading = useAppSelector(selectAuthLoading);
    const adminLoading = useAppSelector(selectAdminLoading);

      // 2. Show loading spinner if either is fetching
     if (userLoading || adminLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
  // 3. Determine who the "Active User" is based on the route requirements
  let activeUser = null;
   if(allowedRoles.includes("admin") && adminUser){
activeUser = adminUser;
   }else if(allowedRoles.includes("user") && normalUser){
activeUser = normalUser;
   }
   
     // 4. If nobody is logged in, redirect them to the correct login page!
    if(!activeUser){
      if(allowedRoles.includes("admin")){
        return <Navigate to={`/admin/login`} replace/>
      }
      return <Navigate to={`/auth/login`} replace/>
    }


    // 5. If they are logged in, but their role doesn't match the route allowedRoles
    // (Example: A normal user manually typing /admin/dashboard in the URL bar)
    if(!allowedRoles.includes(activeUser.role)){
   return <Navigate to="/" replace />; // Boot them back to the home page
    }

    
    // 6. Security passed! Render the protected pages inside
  return <Outlet/>
}

export default ProtectedRoute;

