export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
    socketURL: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
};

export const AUTH_CONFIG = {
    tokenKey: "authToken",
    adminKey: "adminToken",
    userKey: "User",
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
};
