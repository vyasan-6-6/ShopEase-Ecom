console.log("SERVER.JS: Booting up...");
process.on('uncaughtException', (err) => {
    console.error("CRITICAL UNCAUGHT EXCEPTION:", err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error("CRITICAL UNHANDLED REJECTION:", reason);
    process.exit(1);
});
require("dotenv").config();
console.log("SERVER.JS: dotenv loaded.");
const express = require("express");
const config = require("./config/config");
const http = require("http");
const dbConnection = require("./config/db");
const { setupMiddleware } = require('./middlewares/setup');
const { setupRoutes } = require("./routes");
const logger = require("./utils/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

class Server {
    constructor() {
        this.app = express();
        
        // Trust the first proxy (required for express-rate-limit on Render/Heroku)
        this.app.set('trust proxy', 1);
        
        this.server = http.createServer(this.app);
        this.port = config.PORT;
    }

    async initialize() {
        try {
            await dbConnection.connect();

            setupMiddleware(this.app);

            setupRoutes(this.app);



            this.app.use(notFound);
            this.app.use(errorHandler);


            //initialze socket

            logger.info('Server initialized successfully');
        } catch (error) {
            console.error('Server initialization failed:', error);
            logger.error('Server initialization failed:', error);
            process.exit(1);
        }
    }

    async start() {
        await this.initialize();
        this.server.listen(this.port, () => {
            logger.info(`Server running in ${config.NODE_ENV} mode on port ${this.port}`);
            //seeders
        });
        this.setupGracefulShutdown();
    }

    setupGracefulShutdown() {
        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            this.server.close(async () => {
                logger.info('HTTP server closed');

                await dbConnection.disconnect();
                logger.info('Graceful shutdown completed');

                process.exit(0);
            })
        }
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    }

}

const appServer = new Server();
appServer.start();

module.exports = appServer.app;