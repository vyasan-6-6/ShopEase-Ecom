import { adminClient, makeRequest } from "../utils/apiClient";

export const categoryApi = {
    getAllCategories: async () => 
        makeRequest(adminClient, { method: "GET", url: "/admin/categories" }),
    
    createCategory: async (data) => 
        makeRequest(adminClient, { method: "POST", url: "/admin/categories", data }),
    
    updateCategory: async (id, data) => 
        makeRequest(adminClient, { method: "PUT", url: `/admin/categories/${id}`, data }),
    
    deleteCategory: async (id) => 
        makeRequest(adminClient, { method: "DELETE", url: `/admin/categories/${id}` }),
};
