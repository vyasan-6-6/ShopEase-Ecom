const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const config = require("../config/config");
const requestLogger = require("./requestLogger");

const setupMiddleware = (app) => {
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        }),
    );

    const allowedOrigins = [
        config.CORS.ORIGIN,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ];

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV !== "production") {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        allowedHeaders: config.CORS.ALLOWED_HEADERS,
        methods: config.CORS.METHODS,
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
    app.use(cookieParser());

    const limiter = rateLimit({
        windowMs: config.RATE_LIMIT.WINDOW_MS,
        max: config.RATE_LIMIT.MAX_REQUESTS,
        message: {
            success: false,
            message: "Please try again later, you have reached maximum limit for sending or logging.",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    
    // Only apply global rate limiting in production to avoid dev lockouts
    if (config.NODE_ENV === "production") {
        app.use(limiter);
    }

    app.use(express.json({
        limit: "10mb",
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }));//API's
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

const createAuthLimiter =()=>{
    return rateLimit({
        windowMs:config.RATE_LIMIT.WINDOW_MS,
        max:config.RATE_LIMIT.AUTH_MAX_REQUESTS,
         message: {
      success: false,
      message: 'Please try again later, you have reached maximum limit for sending or logging.'
    },
    standardHeaders:true,
    legacyHeaders:false
    });
}

module.exports={
    setupMiddleware,createAuthLimiter
}