import { useState, useEffect, memo } from "react";
import { Plus, Pencil, Trash2, Package, Search, Loader2, Image as ImageIcon } from "lucide-react";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { 
    fetchAdminProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../../redux/features/product/productSlice";
import { 
    selectAllProducts, 
    selectProductLoading, 
    selectProductSubmitting 
} from "../../redux/features/product/productSelectors";
import { fetchCategories } from "../../redux/features/category/categorySlice";
import { selectAllCategories } from "../../redux/features/category/categorySelectors";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const ManageProducts = () => {
    const dispatch = useAppDispatch();
    
    // Selectors
    const products = useAppSelector(selectAllProducts);
    const isLoading = useAppSelector(selectProductLoading);
    const isSubmitting = useAppSelector(selectProductSubmitting);
    const categories = useAppSelector(selectAllCategories);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        if (!categories || categories?.length === 0){//we check for empty array to avoid fetching categories again and again if we already have categories in the state
            dispatch(fetchCategories());
        }
    }, [dispatch]);

    // Create or Update
    const handleSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await dispatch(updateProduct({ id: editingProduct.id || editingProduct._id, data: formData })).unwrap();
                toast.success("Product updated successfully");
            } else {
                await dispatch(createProduct(formData)).unwrap();
                toast.success("Product created successfully");
            }
            setModalOpen(false);
            setEditingProduct(null);
        } catch (err) {
            toast.error(err || "Operation failed");
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            setDeletingId(id);
            await dispatch(deleteProduct(id)).unwrap();
            toast.success("Product deleted");
        } catch (err) {
            toast.error(err || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    const openEdit = (prod) => {
        setEditingProduct(prod);
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const filteredProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Manage your inventory, prices, and product details.
                    </p>
                </div>
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
                <Input
                    leftIcon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name or category..."
                />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Package className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="font-bold text-lg text-gray-500">
                            {searchQuery ? "No products match your search" : "No products yet"}
                        </p>
                        <p className="text-sm mt-1">
                            {searchQuery
                                ? "Try a different search term."
                                : 'Click "Add Product" to create your first one.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Product</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Category</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Price</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Stock</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((prod, idx) => (
                                        <tr
                                            key={prod.id || prod._id}
                                            className={`hover:bg-gray-50 transition-colors ${idx !== filteredProducts.length - 1 ? "border-b border-gray-50" : "border-b-0"
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                        {prod.images && prod.images.length > 0 ? (
                                                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                                                            {prod.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {prod.category?.name || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">${prod.price?.toFixed(2)}</span>
                                                    {prod.compareAtPrice && (
                                                        <span className="text-xs text-gray-400 line-through">${prod.compareAtPrice?.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${prod.stock > 10 ? 'text-gray-700' : prod.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {prod.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                                                        prod.status === "active"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : prod.status === "draft" 
                                                            ? "bg-amber-50 text-amber-600"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {prod.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEdit(prod)}
                                                        className="px-2 py-2"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(prod.id || prod._id)}
                                                        loading={deletingId === (prod.id || prod._id)}
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
                            {filteredProducts.map((prod) => (
                                <div key={prod.id || prod._id} className="p-5 flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {prod.images && prod.images.length > 0 ? (
                                                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                                            <p className="text-sm font-medium text-gray-500 mt-0.5">{prod.category?.name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="font-bold text-gray-900">${prod.price?.toFixed(2)}</span>
                                                <span
                                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                        prod.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {prod.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <span className={`text-sm font-bold ${prod.stock > 10 ? 'text-gray-500' : prod.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                            Stock: {prod.stock}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEdit(prod)} className="px-3">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(prod.id || prod._id)} loading={deletingId === (prod.id || prod._id)} className="px-3">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ProductFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingProduct}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default memo(ManageProducts);
