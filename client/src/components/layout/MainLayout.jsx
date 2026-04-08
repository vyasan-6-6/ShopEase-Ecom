import { Outlet } from "react-router-dom"
import Navbar from "../common/Navbar"
import Footer from "../common/Footer"
import { memo } from "react"

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar/>
        <main className="grow"> {/* 
        flex-grow forces this <main> tag to stretch, which 
        always pins your Footer straight to the bottom of the screen! 
      */}
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default memo(MainLayout)