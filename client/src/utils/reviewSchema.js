import * as yup from "yup";

export const reviewSchema = yup.object().shape({
    rating: yup
        .number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating cannot be more than 5 stars"),
    comment: yup
        .string()
        .trim()
        .required("Review comment is required")
        .min(5, "Comment must be at least 5 characters long")
        .max(1000, "Comment cannot exceed 1000 characters"),
});
