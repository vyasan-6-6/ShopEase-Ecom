import { useState, useEffect } from "react";
import { X, UploadCloud, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { uploadProductImages } from "../../redux/features/product/productSlice";
import { selectActiveCategories } from "../../redux/features/category/categorySelectors";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../utils/productSchema";

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectActiveCategories);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(productSchema),
        mode: "onChange"
    });

    const [selectedFiles, setSelectedFiles] = useState([]); //stores newly selected files
    const [previewUrls, setPreviewUrls] = useState([]); //stores both uploaded and newly selected images
    const [existingImages, setExistingImages] = useState([]); //storing uploaded images url
    const [isUploadingImages, setIsUploadingImages] = useState(false); //flag for uploading images

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || "",
                    description: initialData.description || "",
                    price: initialData.price || "",
                    compareAtPrice: initialData.compareAtPrice || "",
                    category: initialData.category?._id || initialData.category?.id || initialData.category || "",
                    stock: initialData.stock || "",
                    status: initialData.status || "active",
                });
                setExistingImages(initialData.images || []);
                setPreviewUrls(initialData.images || []);
            } else {
                reset({
                    name: "",
                    description: "",
                    price: "",
                    compareAtPrice: "",
                    category: categories.length > 0 ? categories[0].id : "",
                    stock: "",
                    status: "active",
                });
                setExistingImages([]);
                setPreviewUrls([]);
            }
            setSelectedFiles([]);
        }
    }, [isOpen, initialData, categories, reset]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSelectedFiles((prev) => [...prev, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        if (index < existingImages.length){
            // It's an already uploaded image
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            // It's a newly selected file
            const fileIndex = index - existingImages.length;
            setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }
    };

    const handleFormSubmit = async (data) => {
        let finalImages = [...existingImages];

        // If there are new files to upload to cloudinary
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
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
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
                    <form id="productForm" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Input
                                label="Product Name"
                                {...register("name")}
                                error={errors.name?.message}
                                placeholder="e.g. MacBook Pro M3"
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                    Category
                                </label>
                                <select
                                    {...register("category")}
                                    className={`w-full px-4 py-3 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-2xl transition-colors font-medium text-gray-900 shadow-sm ${errors.category ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <span className="text-xs text-red-500 font-medium ml-1">{errors.category.message}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className={`w-full px-4 py-3 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-2xl transition-colors font-medium text-gray-900 shadow-sm resize-none ${errors.description ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                placeholder="Write a detailed description..."
                            />
                            {errors.description && <span className="text-xs text-red-500 font-medium ml-1">{errors.description.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Input
                                type="number"
                                label="Price ($)"
                                min="0"
                                step="0.01"
                                {...register("price")}
                                error={errors.price?.message}
                                placeholder="0.00"
                            />
                            <Input
                                type="number"
                                label="Compare At Price ($)"
                                min="0"
                                step="0.01"
                                {...register("compareAtPrice")}
                                error={errors.compareAtPrice?.message}
                                placeholder="0.00"
                            />
                            <Input
                                type="number"
                                label="Stock"
                                min="0"
                                {...register("stock")}
                                error={errors.stock?.message}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                                Status
                            </label>
                            <select
                                {...register("status")}
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
