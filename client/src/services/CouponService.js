import { adminClient, userClient, makeRequest } from "../utils/apiClient";

const couponApi = {
    // Admin Routes
    getAllCoupons: () => {
        return makeRequest(adminClient, {
            method: "GET",
            url: "/coupon",
        });
    },

    createCoupon: (data) => {
        return makeRequest(adminClient, {
            method: "POST",
            url: "/coupon",
            data,
        });
    },

    updateCoupon: (id, data) => {
        return makeRequest(adminClient, {
            method: "PUT",
            url: `/coupon/${id}`,
            data,
        });
    },

    deleteCoupon: (id) => {
        return makeRequest(adminClient, {
            method: "DELETE",
            url: `/coupon/${id}`,
        });
    },

    // User/Public Routes
    validateCoupon: (code, cartTotal) => {
        return makeRequest(userClient, {
            method: "POST",
            url: "/coupon/validate",
            data: { code, cartTotal },
        });
    },
};

export default couponApi;
