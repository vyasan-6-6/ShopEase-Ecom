import * as yup from "yup";

export const checkoutSchema = yup.object().shape({
    street: yup.string().required("Street address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup.string().required("Zip code is required"),
    country: yup.string().required("Country is required"),
    phone: yup.string().required("Phone number is required")
});
