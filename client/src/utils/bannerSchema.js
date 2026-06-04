import * as yup from "yup";

export const uploadBannerSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    link: yup
        .string()
        .nullable(),
    image: yup
        .mixed()
        .test("required", "Banner image is required", (value) => {
            return value && value.length > 0;
        })
});

export const editBannerSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    link: yup
        .string()
        .nullable(),
    image: yup
        .mixed()
        .nullable() // Image is optional during edit mode
});
