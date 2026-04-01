import axios from "axios";

import { API_CONFIG, AUTH_CONFIG } from "../config/app";
export const tokenService = {
    getAuthToken: () => localStorage.getItem(AUTH_CONFIG.tokenKey),
    getAdminToken: () => localStorage.getItem(AUTH_CONFIG.adminKey),
    getUser: () => {
        const userData = localStorage.getItem(AUTH_CONFIG.userKey);
        return userData ? JSON.parse(userData) : null;
    },

    setAuthToken: (token) => {
        if (token) localStorage.setItem(AUTH_CONFIG.tokenKey, token);
        else localStorage.removeItem(AUTH_CONFIG.tokenKey);
    },

    setAdminToken: (token) => {
        if (token) localStorage.setItem(AUTH_CONFIG.adminKey, token);
        else localStorage.removeItem(AUTH_CONFIG.adminKey);
    },

    clearAll: () => {
        localStorage.removeItem(AUTH_CONFIG.adminKey);
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
    },
};

const createApiClient = (getToken) => {
    const client = axios.create({
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
        headers: API_CONFIG.headers,
    });
    client.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error),
    );

    client.interceptors.response.use(
        (res) => res,
        (error) => {
            const status = error.response?.status;
            if (status === 401) {
                tokenService.clearAll();
               window.location.href = "/login"
            }
            // Handle forbidden
            if (status === 403) {
                console.error("Access denied");
            }

            // Handle timeout
            if (error.code === "ECONNABORTED") {
                console.error("Request timeout");
            }
            return Promise.reject(error);
        },
    );
    return client;
};

export const userClient = createApiClient(tokenService.getAuthToken);
export const adminClient = createApiClient(tokenService.getAdminToken);

export const makeRequest = async (client, config) => {
    try {
        const response = await client(config);
        console.log("response data:", response.data);
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.error?.message || error.response?.data?.error?.message || error.message || "Something went Wrong.";
            console.log("register error findings:",error)
        throw new Error(`makeRequest error: ${message}`);
    }
};
