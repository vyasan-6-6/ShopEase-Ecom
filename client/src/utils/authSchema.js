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

export const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
});

export const addressSchema = yup.object().shape({
    label: yup
        .string()
        .required("Address type is required")
        .oneOf(["home", "work", "other"], "Invalid address type"),
    street: yup
        .string()
        .required("Street address is required")
        .min(5, "Street address is too short")
        .max(200, "Street address is too long"),
    city: yup
        .string()
        .required("City is required")
        .min(2, "City name is too short")
        .max(100, "City name is too long"),
    state: yup
        .string()
        .required("State is required")
        .min(2, "State name is too short")
        .max(100, "State name is too long"),
    zipCode: yup
        .string()
        .required("Zip code is required")
        .matches(/^[0-9]{5,6}$/, "Enter a valid zip code (5-6 digits)"),
    country: yup
        .string()
        .required("Country is required")
        .min(2, "Country name is too short")
        .max(100, "Country name is too long"),
    isDefault: yup.boolean(),
});

export const profileSchema = yup.object().shape({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    phone: yup.string().nullable().notRequired().test(
        'is-valid-phone', 
        'Please enter a valid phone number', 
        (value) => !value || /^\+?[\d\s\-\(\)]+$/.test(value)
    ),
});
