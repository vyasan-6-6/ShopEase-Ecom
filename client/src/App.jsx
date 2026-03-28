import "./App.css";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/auth/Register";
function App() { 
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<Home/>}/> */}
      <Route path="/auth/register" element={<Register/>}/>
      {/* <Route path="/login" element={<Login/>}/> */}
      {/* <Route path="/" element={<Home/>}/> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
