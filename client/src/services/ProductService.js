import { makeRequest, adminClient, userClient } from "../utils/apiClient";

const productApi = {
    // Admin routes
    createProduct: (data) => makeRequest(adminClient, { url: "/admin/products", method: "POST", data }),
    uploadImages: (formData) => makeRequest(adminClient, {
        url: "/admin/products/upload-images",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getAllAdminProducts: () => makeRequest(adminClient, { url: "/admin/products", method: "GET" }),
    updateProduct: (id, data) => makeRequest(adminClient, { url: `/admin/products/${id}`, method: "PUT", data }),
    deleteProduct: (id) => makeRequest(adminClient, { url: `/admin/products/${id}`, method: "DELETE" }),

    // Public routes
    getAllProducts: () => makeRequest(userClient, { url: "/user/products", method: "GET" }),
    getProductById: (id) => makeRequest(userClient, { url: `/user/products/${id}`, method: "GET" }),
    getProductBySlug: (slug) => makeRequest(userClient, { url: `/user/products/slug/${slug}`, method: "GET" }),
};

export default productApi;
