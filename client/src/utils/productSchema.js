import * as yup from "yup";

export const productSchema = yup.object().shape({
    name: yup
        .string()
        .required("Product name is required")
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name cannot exceed 100 characters"),
    description: yup
        .string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    price: yup
        .number()
        .typeError("Price must be a valid number")
        .required("Price is required")
        .positive("Price must be greater than zero")
        .min(0, "Price cannot be negative"),
    compareAtPrice: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
        .nullable()
        .typeError("Compare at price must be a valid number")
        .min(0, "Price cannot be negative")
        .when("price", (price, schema) => {
            return price && price.length > 0
                ? schema.moreThan(price[0], "Compare at price must be greater than regular price")
                : schema;
        }),
    stock: yup
        .number()
        .typeError("Stock must be a valid number")
        .required("Stock is required")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative"),
    category: yup
        .string()
        .required("Category is required"),
    status: yup
        .string()
        .oneOf(["active", "inactive", "draft"], "Invalid status")
        .default("active"),
});
