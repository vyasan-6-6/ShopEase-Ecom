import { useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { couponSchema } from "../../utils/couponSchema";
import Input from "../common/Input";
import Button from "../common/Button";

const CouponFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(couponSchema),
        defaultValues: {
            code: "",
            discountPercent: "",
            expiryDate: "",
            minOrderAmount: 0,
            isActive: true,
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    code: initialData.code || "",
                    discountPercent: initialData.discountPercent || "",
                    expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().slice(0, 16) : "",
                    minOrderAmount: initialData.minOrderAmount || 0,
                    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
                });
            } else {
                reset({
                    code: "",
                    discountPercent: "",
                    expiryDate: "",
                    minOrderAmount: 0,
                    isActive: true,
                });
            }
        }
    }, [initialData, isOpen, reset]);// why is reset listed as a dependency?

    if (!isOpen) return null;

    const submitForm = (data) => {
        onSubmit({
            ...data,
            // Ensure proper ISO string format for backend
            expiryDate: new Date(data.expiryDate).toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-900">
                        {initialData ? "Edit Coupon" : "Create New Coupon"}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="couponForm" onSubmit={handleSubmit(submitForm)} className="space-y-5">
                        <Input
                            label="Coupon Code"
                            placeholder="e.g. SUMMER20"
                            className="uppercase"
                            {...register("code")}
                            error={errors.code?.message}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Discount Percentage"
                                type="number"
                                placeholder="%"
                                {...register("discountPercent")}
                                error={errors.discountPercent?.message}
                            />
                            <Input
                                label="Minimum Order Amount"
                                type="number"
                                placeholder="$"
                                {...register("minOrderAmount")}
                                error={errors.minOrderAmount?.message}
                            />
                        </div>
                        <Input
                            label="Expiry Date & Time"
                            type="datetime-local"
                            {...register("expiryDate")}
                            error={errors.expiryDate?.message}
                        />
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <input
                                type="checkbox"
                                id="isActive"
                                {...register("isActive")}
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <div>
                                <label htmlFor="isActive" className="font-bold text-gray-900 block">
                                    Active Status
                                </label>
                                <p className="text-xs text-gray-500">Allow customers to use this coupon.</p>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" type="button" className="cursor-pointer" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" form="couponForm" disabled={isLoading} className="min-w-[120px] cursor-pointer">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? "Save Changes" : "Create Coupon"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CouponFormModal;
