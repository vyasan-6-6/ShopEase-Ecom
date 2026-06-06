
import { adminClient, makeRequest, tokenService } from "../utils/apiClient"

const adminApi = {
    getProfile: async () => {
        return makeRequest(adminClient, {
            url: "/admin/getProfile",
            method: 'GET',

        });
    },

    loginAdmin: async (credentials) => {
        const res = await makeRequest(adminClient, {
            url: "/admin/login",
            method: 'POST',
            data: credentials,
        });
        if (res?.data?.token) {
            tokenService.setAdminToken(res?.data?.token);
        }
        return res;
    },

    updateProfile: async (data) => {
        return makeRequest(adminClient, {
            url: "/admin/updateProfile",
            method: 'PUT',
            data: data,
        });
    },

    getAllOrders: async (params) => {
        return makeRequest(adminClient, {
            url: "/admin/orders",
            method: 'GET',
            params: params // { status, search }
        });
    },

    updateOrderStatus: async (orderId, status) => {
        return makeRequest(adminClient, {
            url: `/admin/order/${orderId}/status`,
            method: 'PUT',
            data: { status }
        });
    },

    getSalesReport: async (startDate, endDate) => {
        return makeRequest(adminClient, {
            url: "/admin/reports/sales",
            method: 'GET',
            params: { startDate, endDate }
        });
    },

    getDashboardStats: async (days = null) => {
        return makeRequest(adminClient, {
            url: "/admin/stats",
            method: 'GET',
            params: days ? { days } : {}
        });
    },

    getAllUsers: async (search = "") => {
        return makeRequest(adminClient, {
            url: "/admin/users",
            method: 'GET',
            params: search ? { search } : {}
        });
    },

    toggleUserBan: async (userId) => {
        return makeRequest(adminClient, {
            url: `/admin/users/${userId}/ban`,
            method: 'PUT'
        });
    }
}

export default adminApi;
