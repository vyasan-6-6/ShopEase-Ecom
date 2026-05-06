import clsx from "clsx";
import { forwardRef, memo } from "react";

const TextArea = memo(forwardRef(({
    label,
    error,
    rows = 3,
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <textarea
                ref={ref}
                rows={rows}
                className={clsx(
                    "w-full px-4 py-2 rounded-2xl border text-sm outline-none transition resize-none",
                    "focus:ring-2 focus:ring-black",
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}));

TextArea.displayName = "TextArea";
export default TextArea;
