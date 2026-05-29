import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"
import AdminQuickBar from "../admin/AdminQuickBar"
import Chatbot from "../common/Chatbot"
import { memo } from "react"

const MainLayout = () => {
  const location = useLocation();

  // Hide chatbot on Login, Register, and Forgot Password pages
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 uppercase tracking-tight">
        <AdminQuickBar />
        <Navbar/>
        <main className="grow"> {/* 
        flex-grow forces this <main> tag to stretch, which 
        always pins your Footer straight to the bottom of the screen! 
      */}
            <Outlet/>
        </main>
        <Footer/>
        {!isAuthPage && <Chatbot />}
    </div>
  )
}

export default memo(MainLayout)