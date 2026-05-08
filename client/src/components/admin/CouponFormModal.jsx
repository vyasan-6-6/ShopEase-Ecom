import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

const CouponFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [formData, setFormData] = useState({
        code: "",
        discountPercent: "",
        expiryDate: "",
        minOrderAmount: 0,
        isActive: true,
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                code: initialData.code || "",
                discountPercent: initialData.discountPercent || "",
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().slice(0, 16) : "",
                minOrderAmount: initialData.minOrderAmount || 0,
                isActive: initialData.isActive !== undefined ? initialData.isActive : true,
            });
        } else if (isOpen) {
            setFormData({
                code: "",
                discountPercent: "",
                expiryDate: "",
                minOrderAmount: 0,
                isActive: true,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            discountPercent: Number(formData.discountPercent),
            minOrderAmount: Number(formData.minOrderAmount),
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
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
                    <form id="couponForm" onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Coupon Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. SUMMER20"
                            required
                            className="uppercase"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Discount Percentage"
                                name="discountPercent"
                                type="number"
                                min="1"
                                max="100"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                placeholder="%"
                                required
                            />
                            <Input
                                label="Minimum Order Amount"
                                name="minOrderAmount"
                                type="number"
                                min="0"
                                value={formData.minOrderAmount}
                                onChange={handleChange}
                                placeholder="$"
                            />
                        </div>
                        <Input
                            label="Expiry Date & Time"
                            name="expiryDate"
                            type="datetime-local"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
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
                    <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" form="couponForm" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? "Save Changes" : "Create Coupon"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CouponFormModal;
