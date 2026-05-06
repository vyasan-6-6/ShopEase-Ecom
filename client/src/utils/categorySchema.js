import * as yup from "yup";

export const categorySchema = yup.object().shape({
    name: yup
        .string()
        .required("Category name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    description: yup
        .string()
        .max(500, "Description cannot exceed 200 characters")
        .nullable(),
    status: yup
        .string()
        .oneOf(["active", "inactive"], "Invalid status")
        .default("active"),
});
 