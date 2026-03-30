 
import clsx from "clsx";
import { useState } from "react";

const Input = ({
  label,
  type = "text",
  name,
  register,
  rules,        // from react-hook-form
  error,           // error message
  placeholder = "",
  disabled = false,
  className = "", 
  ...props
}) => {
    const [showPassword,setShowPassword] = useState(false);
    const isPassword = type ==="password";
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
  
      <div className="relative">
      <input
        id={name}
        type={isPassword&&showPassword?"text":type}
        placeholder={placeholder}
        disabled={disabled}
        {...(register ? register(name) : {})}
        className={clsx(
          "w-full px-4 py-2 rounded-2xl border text-sm outline-none transition",
          "focus:ring-2 focus:ring-black",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300",
          disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
        {...props}
      /> 
        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}</div>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;