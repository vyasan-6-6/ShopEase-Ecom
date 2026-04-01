import "./App.css";
import { ToastContainer } from "react-toastify";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";
function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="auth/login" element={<Login/>}/>
      <Route path="/auth/register" element={<Register/>}/>
      <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/admin/login" element={<AdminLogin/>}/>


      {/* <Route element={<ProtectedRoute/>}> 
      <Route path="/" element={<Home/>}/>
       <Route path="/" element={<Product/>}/>
       </Route> */}
    </Routes>
    <ToastContainer position="top-right" autoClose={3000}/>
    </BrowserRouter>
  )
}

export default App
