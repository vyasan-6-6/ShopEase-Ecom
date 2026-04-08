import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("First name is required")
        .min(2, "Name too short")
        .max(50, "Name too long"),
    lastName: yup
        .string()
        .required("Last name is required")
        .min(1, "Name too short")
        .max(50, "Name too long"),
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "At least one lowercase letter")
        .matches(/[A-Z]/, "At least one uppercase letter")
        .matches(/[0-9]/, "At least one number"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});
