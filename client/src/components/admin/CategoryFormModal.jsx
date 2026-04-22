import { useState, useEffect, memo } from "react";
import { X } from "lucide-react";

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [form, setForm] = useState({ name: "", description: "", status: "active" });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                description: initialData.description || "",
                status: initialData.status || "active",
            });
        } else {
            setForm({ name: "", description: "", status: "active" });
        }
    }, [initialData,isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!isOpen) return null;

    const isEditing = !!initialData;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 fade-in duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                {isEditing ? "Edit Category" : "Create Category"}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">
                                {isEditing
                                    ? "Update the category details below."
                                    : "Fill in the details to add a new category."}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Category Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder="e.g. Electronics, Clothing"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={500}
                                rows={3}
                                placeholder="Short description of the category (optional)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading && (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {isEditing ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default memo(CategoryFormModal);
