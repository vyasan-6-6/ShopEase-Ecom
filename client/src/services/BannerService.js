import { adminClient, userClient, makeRequest } from "../utils/apiClient";

const bannerApi = {
    getAllBanners: async () =>
        makeRequest(userClient, { method: "GET", url: "/banners" }),

    getAdminBanners: async () =>
        makeRequest(adminClient, { method: "GET", url: "/banners/admin" }),

    createBanner: async (data) =>
        makeRequest(adminClient, {
            method: "POST",
            url: "/banners",
            data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    updateBanner: async (id, data) =>
        makeRequest(adminClient, {
            method: "PUT",
            url: `/banners/${id}`,
            data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    updateBannerStatus: async (id, isActive) =>
        makeRequest(adminClient, {
            method: "PUT",
            url: `/banners/${id}/status`,
            data: { isActive },
        }),

    deleteBanner: async (id) =>
        makeRequest(adminClient, { method: "DELETE", url: `/banners/${id}` }),
};

export default bannerApi;
