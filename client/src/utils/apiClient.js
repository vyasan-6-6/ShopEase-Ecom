import axios from "axios";

import { API_CONFIG, AUTH_CONFIG } from "../config/app";
export const tokenService = {
    getAuthToken: () => localStorage.getItem(AUTH_CONFIG.tokenKey),
    getAdminToken: () => localStorage.getItem(AUTH_CONFIG.adminKey),
    getAnyToken: () => localStorage.getItem(AUTH_CONFIG.tokenKey) || localStorage.getItem(AUTH_CONFIG.adminKey),//shop will be avaible to admin also
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
        withCredentials: true,
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
            const isAuthApi = error.config?.url?.includes("/auth/") || error.config?.url?.includes("/admin/");
            const isAuthPage = window.location.pathname.startsWith("/auth/") || window.location.pathname.startsWith("/admin/");

            // Only redirect to login if it's a 401 (Unauthorized) 
            // and we aren't currently doing an auth request or on an auth page.
            console.log("INTERCEPTOR CAUGHT 401. URL:", error.config?.url, "PATH:", window.location.pathname, "isAuthApi:", isAuthApi, "isAuthPage:", isAuthPage);
            
            if (status === 401 && !isAuthApi && !isAuthPage) {
                console.warn("Unauthorized access detected. Clearing session and redirecting...");
                tokenService.clearAll(); // Clear localStorage to break the loop
                window.location.href = "/auth/login";
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

export const userClient = createApiClient(tokenService.getAnyToken);
export const adminClient = createApiClient(tokenService.getAdminToken);

export const makeRequest = async (client, config) => {
    try {
        const response = await client(config);
        return response.data;
    } catch (error) {
        let message =
        error.response?.data?.error?.message || error.message || "Something went Wrong.";
        // If the backend hands us an array of specific field validation errors (like Joi length constraints)
        // unpack the foremost detail so the frontend gets the exact specific string!
        const payload = error.response?.data?.error;
        if (payload?.code === "VALIDATION_ERROR" && payload.details?.length > 0) {
            const rawDetail = payload.details[0].message;
            message = rawDetail.replace(/['"]/g, ""); // "Password" -> Password
        }
            
        throw new Error(message);
    }
};
