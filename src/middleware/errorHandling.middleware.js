import 'dotenv/config';
import { disconnectDB } from "../config/db.config.js";

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection: ", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: ", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
})

// Graceful shutdown on SIGTERM
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});