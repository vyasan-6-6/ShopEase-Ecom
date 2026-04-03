import clsx from "clsx";
import { forwardRef, memo } from "react";
import { useState } from "react";

const Input = memo(forwardRef(({
    label,
    type = "text",
    error, // error message
    ...inputProps
},ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    ref={ref}
                    className={clsx(
                        "w-full px-4 py-2 rounded-2xl border text-sm outline-none transition",
                        "focus:ring-2 focus:ring-black",
                        error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                    )}
                    {...inputProps}
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
                )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}));

Input.displayName = "Input";
export default Input;
