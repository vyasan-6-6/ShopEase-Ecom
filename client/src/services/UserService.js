import { makeRequest, tokenService, userClient } from "../utils/apiClient";

export const userApi = {
    updateProfile: (data) => {
        return makeRequest(userClient, {
            url: "/user/profile",
            method: "PATCH",
            data: data,
        });
    },
    getProfile: () => makeRequest(userClient, { url: "/user/profile", method: "GET" }),
};
