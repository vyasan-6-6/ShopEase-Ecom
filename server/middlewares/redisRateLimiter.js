const { redisClient, isRedisAvailable } = require("../config/redis");
const logger = require("../utils/logger");

/**
 * Custom Redis Rate Limiter Middleware
 * @param {Object} options
 * @param {number} options.windowInSeconds - Time window in seconds (default 900s / 15m)
 * @param {number} options.maxRequests - Maximum requests allowed per window (default 10)
 * @param {string} options.prefix - Prefix for Redis keys
 */
const createRedisRateLimiter = (options = {}) => {
    const windowInSeconds = options.windowInSeconds || 15 * 60; // 15 minutes
    const maxRequests = options.maxRequests || 10;
    const prefix = options.prefix || "rl";

    return async (req, res, next) => {
        // Fallback to next() if Redis is not connected
        if (!isRedisAvailable() || !redisClient) {
            return next();
        }

        try {
            const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
            const key = `ratelimit:${prefix}:${ip}`;

            const currentRequests = await redisClient.incr(key);

            if (currentRequests === 1) {
                await redisClient.expire(key, windowInSeconds);
            }

            const ttl = await redisClient.ttl(key);

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - currentRequests));
            res.setHeader("X-RateLimit-Reset", ttl);

            if (currentRequests > maxRequests) {
                logger.warn(`Rate limit exceeded for IP: ${ip} on route: ${req.originalUrl}`);
                return res.status(429).json({
                    success: false,
                    error: {
                        code: "TOO_MANY_REQUESTS",
                        message: `Too many requests from this IP. Please try again in ${ttl} seconds.`,
                        status: 429,
                    },
                });
            }

            next();
        } catch (error) {
            logger.warn(`Redis Rate Limiter error: ${error.message}`);
            next(); // Pass through on unexpected errors
        }
    };
};

module.exports = createRedisRateLimiter;
