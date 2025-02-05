import express from "express";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";
import { securityMiddleware } from "./middleware/security";
import router from "./routes";
import { disconectDB } from "./config/db";

const app = express();
app.use(express.json());

app.use(securityMiddleware);
app.disable("x-powered-by");


app.use(router);

app.use(errorHandler);

// Uncaught error logging
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Rejection:", error);
    process.exit(1);
});

process.on("SIGTERM",disconectDB);
process.on("SIGINT",disconectDB);

export default app;
