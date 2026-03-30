import React from "react";
import clsx from "clsx";

const Input = ({
  label,
  type = "text",
  name,
  register,        // from react-hook-form
  error,           // error message
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
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

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;