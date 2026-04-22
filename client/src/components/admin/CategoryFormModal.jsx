import { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../utils/categorySchema";
import Modal from "../common/Modal";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Select from "../common/Select";
import Button from "../common/Button";

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            status: "active",
        },
    });

    const descriptionValue = watch("description") || "";
    const isEditing = Boolean(initialData);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || "",
                    description: initialData.description || "",
                    status: initialData.status || "active",
                });
            } else {
                reset({ name: "", description: "", status: "active" });
            }
        }
    }, [initialData, isOpen, reset]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEditing ? "Edit Category" : "Create Category"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Category Name"
                    {...register("name")}
                    placeholder="e.g. Electronics, Clothing"
                    error={errors.name?.message}
                />

                <div className="relative">
                    <TextArea
                        label="Description"
                        {...register("description")}
                        placeholder="Short description of the category (optional)"
                        error={errors.description?.message}
                    />
                    <p className="absolute top-0 right-0 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {descriptionValue.length}/500
                    </p>
                </div>

                <Select
                    label="Status"
                    {...register("status")}
                    options={[
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                    ]}
                    error={errors.status?.message}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isLoading}>
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default memo(CategoryFormModal);


