import "./App.css";
import { ToastContainer } from "react-toastify";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
function App() { 
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<Home/>}/> */}
      <Route path="/auth/register" element={<Register/>}/>
      <Route path="auth/login" element={<Login/>}/>
      {/* <Route path="/" element={<Home/>}/> */}
    </Routes>
    <ToastContainer position="top-right" autoClose={3000}/>
    </BrowserRouter>
  )
}

export default App
