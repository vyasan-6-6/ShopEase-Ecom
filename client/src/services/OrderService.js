import { userClient,makeRequest } from "../utils/apiClient";

const OrderService = {
    createOrder: (data) => {
        return makeRequest(userClient, {
            method: "POST",
            url: "/orders/create",
            data,
        });
    },
    verifyPayment: (data) => {
        return makeRequest(userClient, {
            method: "POST",
            url: "/orders/verify-payment",
            data,
        });
    },
    getMyOrders: () => {
         return makeRequest(userClient, {
            method: "GET",
            url: "/orders/my-orders",
        });
    }
}

export default OrderService;
