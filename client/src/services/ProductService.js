import { makeRequest, adminClient, userClient } from "../utils/apiClient";

const productApi = {
    // Admin routes
    createProduct: (data) => makeRequest(adminClient, { url: "/products", method: "POST", data }),
    uploadImages: (formData) => makeRequest(adminClient, {
        url: "/products/upload-images",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getAllAdminProducts: () => makeRequest(adminClient, { url: "/products", method: "GET", params: { limit: 1000 } }),
    updateProduct: (id, data) => makeRequest(adminClient, { url: `/products/${id}`, method: "PUT", data }),
    deleteProduct: (id) => makeRequest(adminClient, { url: `/products/${id}`, method: "DELETE" }),

    // Public routes
    getAllProducts: (params) => makeRequest(userClient, { url: "/products", method: "GET", params }),
    getProductById: (id) => makeRequest(userClient, { url: `/products/${id}`, method: "GET" }),
    getProductBySlug: (slug) => makeRequest(userClient, { url: `/products/slug/${slug}`, method: "GET" }),

    // Reviews
    getLatestReviews: () => makeRequest(userClient, { url: `/products/reviews/latest`, method: "GET" }),
    getProductReviews: (productId) => makeRequest(userClient, { url: `/products/${productId}/reviews`, method: "GET" }),
    addReview: (productId, data) => makeRequest(userClient, { url: `/products/${productId}/reviews`, method: "POST", data }),
};

export default productApi;
