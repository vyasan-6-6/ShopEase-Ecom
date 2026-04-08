import { memo } from "react"
import { Link } from "react-router-dom"

 

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
<div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
  <Link to="/" className="text-2xl font-bold text-indigo-600">
          ShopEase
        </Link>
          <div className="flex-1 max-w-lg mx-8">
           <input 
             type="text" 
             placeholder="Search products..." 
             className="w-full px-4 py-2 border rounded-md"
           />
        </div>
        {/* 3. Right side links */}
        <div className="flex space-x-6">
          <Link to="/cart" className="text-gray-600 hover:text-indigo-600">Cart</Link>
          <Link to="/auth/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
        </div>

</div>
    </nav>
  )
}

export default memo(Navbar)