import { userClient, makeRequest } from "../utils/apiClient";

const cartApi = {
    getCart: async () =>
        makeRequest(userClient, { method: "GET", url: "/cart" }),

    addToCart: async (productId, quantity = 1) =>
        makeRequest(userClient, {
            method: "POST",
            url: "/cart/add",
            data: { productId, quantity }
        }),

    updateQuantity: async (productId, quantity) =>
        makeRequest(userClient, {
            method: "PUT",
            url: "/cart/update",
            data: { productId, quantity }
        }),

    removeFromCart: async (productId) =>
        makeRequest(userClient, {
            method: "DELETE",
            url: `/cart/remove/${productId}`
        }),

    clearCart: async () =>
        makeRequest(userClient, { method: "DELETE", url: "/cart/clear" }),


    mergeCart: async (localItems) => makeRequest(userClient, { method: "POST", url: "/cart/merge" ,data:{localItems}}),
};

export default cartApi;
