import { adminClient, userClient, makeRequest } from "../utils/apiClient";

const categoryApi = {
    getAllCategories: async () =>
        makeRequest(userClient, { method: "GET", url: "/categories" }),

    createCategory: async (data) =>
        makeRequest(adminClient, { method: "POST", url: "/categories", data }),
    
    updateCategory: async (id, data) => 
        makeRequest(adminClient, { method: "PUT", url: `/categories/${id}`, data }),
    
    deleteCategory: async (id) => 
        makeRequest(adminClient, { method: "DELETE", url: `/categories/${id}` }),
};

export default categoryApi;
