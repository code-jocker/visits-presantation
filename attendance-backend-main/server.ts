import express from "express";
import { NextFunction,type Request,type Response } from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import { initializeDatabase } from "./config/database";

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

//Trach database connection status
let dbconnected = false;
let dbConnectionError: Error | null = null;

// Initialize database connection
initializeDatabase()
    .then(({ success, error }) => {
        if (!success) {
            dbConnectionError = error ?? new Error("Database initialization failed.");
            return;
        }
        dbconnected = true;
        console.log("Database connected successfully.");
    })
    .catch((error: unknown) => {
        dbConnectionError = error instanceof Error ? error : new Error(String(error));
        console.error("Database connection failed:", error);
    });

    // cross origins for security

    const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.VITE_APP_URL,
        "https://backend.eac-se.com",
        "https://one.eac-se.com",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:5174",
    ].filter(Boolean);

    const isProduction = process.env.NODE_ENV === "production";

    app.use(cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            // In production, dynamically reflect the request origin
            if (isProduction) {
                return callback(null, origin);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            const message = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(message), false);
        },
        credentials: true,
        allowedHeaders:["Content-Type","Authorization"],
        methods:["GET","POST","PUT","DELETE","OPTIONS"],
        exposedHeaders:["set-cookie"],
    }));

    app.use(morgan("combined"));
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser());

//Swagger setup
import { RegisterRoutes } from "./generated/routes";
import errorHandlerMiddleware from "./middlewares/errorHandler";

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(swaggerUi.generateHTML(await import("./public/swagger.json")));
});

//Root route-shows status without redirect

app.get("/",(req:Request,res:Response)=>{
    if(!dbconnected){
        return res.status(503).json({
            status:"error",
            message:"Database connection failed",
            error: dbConnectionError ? dbConnectionError.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }

    res.json({
        version:"1.0.0",
        name:"Attendance Management API",
        database: dbconnected ? "Connected" : "Disconnected",
        documentation:"/docs",
        status:"success",
        message:"API is running",
        timestamp: new Date().toISOString(),
        });
});

//Register TSOA-generated routes
RegisterRoutes(app);

const [notFoundHandler, errorHandler,errorLogger] = errorHandlerMiddleware();
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

export default app;