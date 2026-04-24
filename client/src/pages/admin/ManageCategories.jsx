import { useState, useEffect, memo } from "react";
import { Plus, Pencil, Trash2, Tag, Search, Loader2 } from "lucide-react";
import CategoryFormModal from "../../components/admin/CategoryFormModal";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../../redux/features/category/categorySlice";
import { 
    selectAllCategories, 
    selectCategoryLoading, 
    selectCategorySubmitting 
} from "../../redux/features/category/categorySelectors";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const ManageCategories = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories);
    const isLoading = useAppSelector(selectCategoryLoading);
    const isSubmitting = useAppSelector(selectCategorySubmitting);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(()=>{
        dispatch(fetchCategories());
    },[dispatch]);
    // Create or Update
    const handleSubmit = async (formData) => {
        try {
            if (editingCategory) {
                await dispatch(updateCategory({ id: editingCategory.id, data: formData })).unwrap();
                toast.success("Category updated successfully");
            } else {
                await dispatch(createCategory(formData)).unwrap();
                toast.success("Category created successfully");
            }
            setModalOpen(false);
            setEditingCategory(null);
        } catch (err) {
            toast.error(err || "Operation failed");
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            setDeletingId(id);
            await dispatch(deleteCategory(id)).unwrap();
            toast.success("Category deleted");
        } catch (err) {
            toast.error(err || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    const openEdit = (cat) => {
        setEditingCategory(cat);
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Manage product categories for your storefront.
                    </p>
                </div>
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
                <Input
                    leftIcon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Tag className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="font-bold text-lg text-gray-500">
                            {searchQuery ? "No categories match your search" : "No categories yet"}
                        </p>
                        <p className="text-sm mt-1">
                            {searchQuery
                                ? "Try a different search term."
                                : 'Click "Add Category" to create your first one.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Name</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Slug</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Created</th>
                                        <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((cat, idx) => (
                                        <tr
                                            key={cat.id}
                                            className={`hover:bg-gray-50 transition-colors ${idx !== filteredCategories.length - 1 ? "border-b border-gray-50" : "border-b-0"
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-sm">
                                                        {cat.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{cat.name}</p>
                                                        {cat.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                                                                {cat.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                    {cat.slug}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                                                        cat.status === "active"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {cat.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {new Date(cat.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEdit(cat)}
                                                        className="px-2 py-2"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(cat.id)}
                                                        loading={deletingId === cat.id}
                                                        className="px-2 py-2"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {filteredCategories.map((cat) => (
                                <div key={cat.id} className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-sm flex-shrink-0">
                                            {cat.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{cat.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                        cat.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {cat.status}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(cat.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEdit(cat)}
                                            className="px-2 py-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(cat.id)}
                                            loading={deletingId === cat.id}
                                            className="px-2 py-2"
                                        >
                                            {!deletingId && <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Category Summary */}
            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                <span>Total: <strong className="text-gray-900">{categories.length}</strong></span>
                <span>Active: <strong className="text-emerald-600">{categories.filter((c) => c.status === "active").length}</strong></span>
                <span>Inactive: <strong className="text-gray-500">{categories.filter((c) => c.status === "inactive").length}</strong></span>
            </div>

            <CategoryFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingCategory}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default memo(ManageCategories);

