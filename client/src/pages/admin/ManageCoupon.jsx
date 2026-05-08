import { useState, useEffect, memo } from "react";
import { Plus, Pencil, Trash2, Ticket, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { 
    fetchCoupons, 
    createCoupon, 
    updateCoupon, 
    deleteCoupon 
} from "../../redux/features/coupon/couponSlice";
import { 
    selectAllCoupons, 
    selectCouponLoading 
} from "../../redux/features/coupon/couponSelectors";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { confirmDelete } from "../../utils/alerts";
import CouponFormModal from "../../components/admin/CouponFormModal";

const ManageCoupon = () => {
    const dispatch = useAppDispatch();
    
    // Selectors
    const coupons = useAppSelector(selectAllCoupons);
    const isLoading = useAppSelector(selectCouponLoading);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    // Create or Update
    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);
            if (editingCoupon) {
                await dispatch(updateCoupon({ id: editingCoupon.id || editingCoupon._id, data: formData })).unwrap();
                toast.success("Coupon updated successfully");
            } else {
                await dispatch(createCoupon(formData)).unwrap();
                toast.success("Coupon created successfully");
            }
            setModalOpen(false);
            setEditingCoupon(null);
        } catch (err) {
            toast.error(err || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        const confirmed = await confirmDelete("Delete Coupon?", "Are you sure you want to permanently delete this coupon?");
        if (!confirmed) return;
        try {
            setDeletingId(id);
            await dispatch(deleteCoupon(id)).unwrap();
            toast.success("Coupon deleted successfully");
        } catch (err) {
            toast.error(err || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    const openEdit = (coupon) => {
        setEditingCoupon(coupon);
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditingCoupon(null);
        setModalOpen(true);
    };

    const filteredCoupons = (coupons || []).filter((c) =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Coupons</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Create and manage discount codes for your customers.
                    </p>
                </div>
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Coupon
                </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
                <Input
                    leftIcon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by coupon code..."
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading && coupons.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Ticket className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="font-bold text-lg text-gray-500">
                            {searchQuery ? "No coupons match your search" : "No coupons found"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Code</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Discount</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Min Order</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Expiry</th>
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCoupons.map((c, idx) => {
                                        const isExpired = new Date(c.expiryDate) < new Date();
                                        return (
                                            <tr key={c.id || c._id} className={`hover:bg-gray-50 transition-colors ${idx !== filteredCoupons.length - 1 ? "border-b border-gray-50" : ""}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                                            <Ticket className="w-5 h-5" />
                                                        </div>
                                                        <p className="font-bold text-gray-900 tracking-wide uppercase">{c.code}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-black text-gray-900">{c.discountPercent}%</td>
                                                <td className="px-6 py-4 font-bold text-gray-600">
                                                    {c.minOrderAmount > 0 ? `$${c.minOrderAmount}` : "None"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-medium ${isExpired ? "text-red-500" : "text-gray-600"}`}>
                                                        {new Date(c.expiryDate).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                                                        !c.isActive ? "bg-gray-100 text-gray-500" : isExpired ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                                    }`}>
                                                        {!c.isActive ? "Inactive" : isExpired ? "Expired" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openEdit(c)} className="px-2 py-2" title="Edit">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDelete(c.id || c._id)} loading={deletingId === (c.id || c._id)} className="px-2 py-2" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {filteredCoupons.map((c) => {
                                const isExpired = new Date(c.expiryDate) < new Date();
                                return (
                                    <div key={c.id || c._id} className="p-5 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                                    <Ticket className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 tracking-wide uppercase">{c.code}</p>
                                                    <p className="text-sm font-black text-indigo-600">{c.discountPercent}% OFF</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                !c.isActive ? "bg-gray-100 text-gray-500" : isExpired ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                            }`}>
                                                {!c.isActive ? "Inactive" : isExpired ? "Expired" : "Active"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Min Order: </span>
                                                <span className="font-bold">{c.minOrderAmount > 0 ? `$${c.minOrderAmount}` : "None"}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Expiry: </span>
                                                <span className={`font-bold ${isExpired ? "text-red-500" : "text-gray-900"}`}>{new Date(c.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                                            <Button variant="outline" size="sm" onClick={() => openEdit(c)} className="px-3">
                                                <Pencil className="w-4 h-4" title="Edit"/> 
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(c.id || c._id)} loading={deletingId === (c.id || c._id)} className="px-3">
                                                <Trash2 className="w-4 h-4" title="Delete"/>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <CouponFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingCoupon(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingCoupon}
                isLoading={submitting}
            />
        </div>
    );
};

export default memo(ManageCoupon);
