import { useState, useEffect, useMemo } from "react";
import bannerApi from "../../services/BannerService";
import Swal from "sweetalert2";
import { uploadBannerSchema, editBannerSchema } from "../../utils/bannerSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

let globalCachedBanners = null;

const BannerManagement = () => {
    const [banners, setBanners] = useState(globalCachedBanners || []);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingBannerId, setEditingBannerId] = useState(null);
    const resolver = useMemo(() => yupResolver(editingBannerId ? editBannerSchema : uploadBannerSchema), [editingBannerId]);
    
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver,
        defaultValues: { title: "", link: "", image: null }
    });

    useEffect(() => {
        if (!globalCachedBanners) {
            fetchBanners();
        }
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await bannerApi.getAdminBanners();
            if (res.data?.banners) {
                globalCachedBanners = res.data.banners;
                setBanners(res.data.banners);
            }
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            Swal.fire("Error", "Failed to fetch banners", "error");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingBannerId(null);
        reset({ title: "", link: "", image: null });
        document.getElementById("bannerImageInput").value = ""; 
    };

    const handleEdit = (banner) => {
        setEditingBannerId(banner.id);
        setValue("title", banner.title);
        setValue("link", banner.link || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmitForm = async (data) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("title", data.title);
            if (data.link) formData.append("link", data.link);
            
            // React Hook Form handles files as a FileList
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            if (editingBannerId) {
                await bannerApi.updateBanner(editingBannerId, formData);
                Swal.fire("Success", "Banner updated successfully!", "success");
            } else {
                await bannerApi.createBanner(formData);
                Swal.fire("Success", "Banner uploaded successfully!", "success");
            }
            
            resetForm();
            fetchBanners();
        } catch (error) {
            console.error("Operation failed:", error);
            Swal.fire("Error", error?.response?.data?.message || "Operation failed", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await bannerApi.updateBannerStatus(id, !currentStatus);
            Swal.fire("Success", `Banner ${currentStatus ? 'deactivated' : 'activated'} successfully!`, "success");
            fetchBanners();
        } catch (error) {
            console.error("Failed to update status:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this banner deletion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });
        
        if (!result.isConfirmed) return;
        
        try {
            await bannerApi.deleteBanner(id);
            Swal.fire("Deleted!", "Your banner has been deleted.", "success");
            fetchBanners();
        } catch (error) {
            console.error("Failed to delete banner:", error);
            Swal.fire("Error", "Failed to delete banner", "error");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Banner Management</h1>

            {/* Upload/Edit Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                    {editingBannerId ? "Update Banner" : "Upload New Banner"}
                </h2>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            {...register("title")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : ""}`}
                            placeholder="Spring Sale 2026"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
                        <input
                            type="text"
                            {...register("link")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.link ? "border-red-500" : ""}`}
                            placeholder="/category/spring"
                        />
                        {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {editingBannerId ? "Banner Image (Leave empty to keep current)" : "Banner Image *"}
                        </label>
                        <input
                            id="bannerImageInput"
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.image ? "border-red-500 border" : ""}`}
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                        </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`px-4 py-2 text-white rounded-md font-medium ${
                                isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isUploading ? "Processing..." : (editingBannerId ? "Update Banner" : "Upload Banner")}
                        </button>
                        {editingBannerId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md font-medium hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Existing Banners</h2>
                {loading ? (
                    <p className="text-gray-500">Loading banners...</p>
                ) : banners.length === 0 ? (
                    <p className="text-gray-500">No banners found. Upload one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-3 font-medium text-gray-600">Image</th>
                                    <th className="p-3 font-medium text-gray-600">Title</th>
                                    <th className="p-3 font-medium text-gray-600">Link</th>
                                    <th className="p-3 font-medium text-gray-600">Status</th>
                                    <th className="p-3 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                className="h-16 w-32 object-cover rounded shadow-sm border"
                                            />
                                        </td>
                                        <td className="p-3 font-medium text-gray-800">{banner.title}</td>
                                        <td className="p-3 text-gray-500 text-sm">
                                            {banner.link || "-"}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    banner.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {banner.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(banner.id, banner.isActive)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    {banner.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerManagement;
