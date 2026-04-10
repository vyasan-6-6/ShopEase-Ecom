import clsx from "clsx";
import { memo } from "react";
const Button = memo(({ children,
  type = "button",
  variant = "primary", // primary | secondary | outline | danger
  size = "md", // sm | md | lg
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props})=>{
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 shadow-lg shadow-indigo-200",
    secondary:
      "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-200",
    outline:
      "border-2 border-gray-200 text-gray-700 hover:border-indigo-600 hover:text-indigo-600 focus:ring-indigo-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

return (
    <button
    
    type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(baseStyles,variants[variant],sizes[size],fullWidth && "w-full",(disabled || loading) && "opacity-60 cursor-not-allowed",className)}>
 {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
)
});
export default Button;