import clsx from "clsx";
import { forwardRef, memo } from "react";
//forwardRef is used to forward the ref to the select element
const Select = memo(forwardRef(({
    label,
    error,
    options = [],
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                ref={ref}
                className={clsx(
                    "w-full px-4 py-2 rounded-2xl border text-sm outline-none transition appearance-none bg-white",
                    "focus:ring-2 focus:ring-black",
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                )}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}));

Select.displayName = "Select";
export default Select;
