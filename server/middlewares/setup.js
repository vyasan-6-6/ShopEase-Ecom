const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const config = require("../config/config");
const requestLogger = require("../utils/logger");

const setupMiddleware = (app) => {
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        }),
    );

    const limiter = rateLimit({
        windowMs: config.RATE_LIMIT.WINDOW_MS,
        max: config.RATE_LIMIT.MAX_REQUESTS,
        message: {
            success: false,
            message: "Too many requests from this IP, please try again later.",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use(limiter);

    const corsOptions = {
        origin:config.CORS.ORIGIN,
        credential:config.CORS.CREDENTIALS,
        allowedHeaders:config.CORS.ALLOWED_HEADERS,
        method:config.CORS.METHODS,
        optionsSuccessStatus:200
    }

    app.use(cors(corsOptions));

    app.use(express.json({limit:"10m"}));//API's
    app.use(express.urlencoded({extended:true}));//form data

    app.use(requestLogger);//custom logging middleware

    app.get("/health",(req,res)=>{
        res.status(200).json({
            success:true,
            message:"server is running",
            timeStamp:new Date().toISOString(),
            uptime:process.uptime(),//= Time (in seconds) since your Node.js app started running
            environment:config.NODE_ENV
        });
    });
};
 

module.exports={
    setupMiddleware
}