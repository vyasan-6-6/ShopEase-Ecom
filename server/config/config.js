module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/ShopEase_Ecomm",

    JWT: {
        USER_SECRET: process.env.JWT_USER_SECRET,
        ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
        EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
    BCRYPT_ROUNDS: 12,
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX_REQUESTS: 100,
        AUTH_MAX_REQUESTS: 5,
    },

    CORS: {
        ORIGIN: process.env.FRONTEND_URL || "http://localhost:3000",
        CREDENTIALS: true,
        METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        ALLOWED_HEADERS: ["Content-Type", "Authorization", "X-Requested-With"],
    },

    DEFAULT_ADMIN: {
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD,
        NAME: process.env.ADMIN_NAME,
    },

    SOCKET: {
        CORS_ORIGIN: process.env.FRONTEND_URL,
        METHODS: ["GET", "POST"],
        CREDENTIALS: true,
    },

    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },

    LOGGING: {
        LEVEL: process.env.LOG_LEVEL || "info",
        MAX_FILES: 5,
        MAX_SIZE: "20m",
    },
    CLOUDINARY: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    OpenRouter: {
        API_KEY: process.env.OPENROUTER_API_KEY,
    },
    OpenAI: {
        API_KEY: process.env.OPENAI_API_KEY,
    },
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
    REDIS: {
        HOST: process.env.REDIS_HOST || "127.0.0.1",
        PORT: process.env.REDIS_PORT || 6379,
        PASSWORD: process.env.REDIS_PASSWORD || null,
    }
};
