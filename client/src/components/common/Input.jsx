import clsx from "clsx";
import { forwardRef, memo } from "react";
import { useState } from "react";

const Input = memo(forwardRef(({
    label,
    type = "text",
    error, // error message
    leftIcon: LeftIcon,//this means whatever i pass in leftIcon, it will be stored as LeftIcon instead of leftIcon so that i can use it as <LeftIcon />
    ...inputProps
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

            <div className="relative group">
                {LeftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                        <LeftIcon className="w-4 h-4" />
                    </div>
                )}
                <input
                    type={isPassword && showPassword ? "text" : type}
                    ref={ref}
                    className={clsx(
                        "w-full py-2 rounded-2xl border text-sm outline-none transition",
                        LeftIcon ? "pl-11 pr-4" : "px-4",
                        "focus:ring-2 focus:ring-black focus:border-black",
                        error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                    )}
                    {...inputProps}
                />
                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold hover:text-black"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
    );
}));

Input.displayName = "Input";
export default Input;
