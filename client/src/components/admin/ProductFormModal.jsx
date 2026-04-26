import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Loader2, UploadCloud, XCircle } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { uploadProductImages } from "../../redux/features/product/productSlice";
import { selectAllCategories } from "../../redux/features/category/categorySelectors";

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories);
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        compareAtPrice: "",
        category: "",
        stock: "",
        status: "active",
        images: [],
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    description: initialData.description || "",
                    price: initialData.price || "",
                    compareAtPrice: initialData.compareAtPrice || "",
                    category: initialData.category?._id || initialData.category?.id || initialData.category || "",
                    stock: initialData.stock || "",
                    status: initialData.status || "active",
                    images: initialData.images || [],
                });
                setPreviewUrls(initialData.images || []);
            } else {
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    compareAtPrice: "",
                    category: categories.length > 0 ? categories[0].id : "",
                    stock: "",
                    status: "active",
                    images: [],
                });
                setPreviewUrls([]);
            }
            setSelectedFiles([]);
        }
    }, [isOpen, initialData, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSelectedFiles((prev) => [...prev, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        if (index < formData.images.length) {
            // It's an already uploaded image
            setFormData((prev) => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        } else {
            // It's a newly selected file
            const fileIndex = index - formData.images.length;
            setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalImages = [...formData.images];

        // If there are new files to upload
        if (selectedFiles.length > 0) {
            setIsUploadingImages(true);
            const uploadData = new FormData();
            selectedFiles.forEach((file) => {
                uploadData.append("images", file);
            });

            try {
                const urls = await dispatch(uploadProductImages(uploadData)).unwrap();
                finalImages = [...finalImages, ...urls];
            } catch (error) {
                setIsUploadingImages(false);
                return; // Stop submission if upload fails
            }
            setIsUploadingImages(false);
        }

        const submitData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
            images: finalImages,
        };

        onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <h2 className="text-xl font-black text-gray-900">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. MacBook Pro M3"
                                required
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-2xl transition-colors font-medium text-gray-900 shadow-sm"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-2xl transition-colors font-medium text-gray-900 shadow-sm resize-none"
                                placeholder="Write a detailed description..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Input
                                type="number"
                                label="Price ($)"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                            <Input
                                type="number"
                                label="Compare At Price ($)"
                                name="compareAtPrice"
                                min="0"
                                step="0.01"
                                value={formData.compareAtPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                            <Input
                                type="number"
                                label="Stock"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-2xl transition-colors font-medium text-gray-900 shadow-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                Product Images
                            </label>
                            
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:bg-gray-50 transition-colors relative">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                        >
                                            <span>Upload images</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, WEBP up to 5MB each
                                    </p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {previewUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-white/80 text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <Button variant="outline" onClick={onClose} disabled={isLoading || isUploadingImages}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        form="productForm" 
                        loading={isLoading || isUploadingImages}
                        className="min-w-[120px]"
                    >
                        {isUploadingImages ? "Uploading..." : initialData ? "Save Changes" : "Create Product"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;
