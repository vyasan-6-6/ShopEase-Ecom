const Redis = require("ioredis");
const config = require("./config");
const logger = require("../utils/logger");

let redisClient = null;
let isRedisAvailable = false;

try {
    const redisOptions = {
        host: config.REDIS.HOST,
        port: config.REDIS.PORT,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
    };

    if (config.REDIS.PASSWORD) {
        redisOptions.password = config.REDIS.PASSWORD;
    }

    redisClient = new Redis(redisOptions);

    redisClient
        .connect()
        .then(() => {
            isRedisAvailable = true;
            logger.info(`Redis connected successfully to ${config.REDIS.HOST}:${config.REDIS.PORT}`);
        })
        .catch((err) => {
            isRedisAvailable = false;
            logger.warn(`Redis connection unavailable (${err.message}). Falling back to direct database execution.`);
        });

    redisClient.on("error", (err) => {
        if (isRedisAvailable) {
            logger.warn(`Redis error: ${err.message}`);
        }
        isRedisAvailable = false;
    });

    redisClient.on("ready", () => {
        isRedisAvailable = true;
        logger.info("Redis client ready");
    });
} catch (error) {
    logger.warn(`Failed to initialize Redis client: ${error.message}`);
}

const getCache = async (key) => {
    if (!isRedisAvailable || !redisClient) return null;
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        logger.warn(`Redis getCache error for key ${key}: ${err.message}`);
        return null;
    }
};

const setCache = async (key, value, ttlInSeconds = 600) => {
    if (!isRedisAvailable || !redisClient) return false;
    try {
        await redisClient.set(key, JSON.stringify(value), "EX", ttlInSeconds);
        return true;
    } catch (err) {
        logger.warn(`Redis setCache error for key ${key}: ${err.message}`);
        return false;
    }
};

const deleteCache = async (key) => {
    if (!isRedisAvailable || !redisClient) return false;
    try {
        await redisClient.del(key);
        return true;
    } catch (err) {
        logger.warn(`Redis deleteCache error for key ${key}: ${err.message}`);
        return false;
    }
};

const flushCachePattern = async (pattern) => {
    if (!isRedisAvailable || !redisClient) return false;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
        return true;
    } catch (err) {
        logger.warn(`Redis flushCachePattern error for pattern ${pattern}: ${err.message}`);
        return false;
    }
};

module.exports = {
    redisClient,
    isRedisAvailable: () => isRedisAvailable,
    getCache,
    setCache,
    deleteCache,
    flushCachePattern,
};
