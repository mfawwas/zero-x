import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import { connectDB } from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.routes.js";
import "./src/middleware/errorHandling.middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));

config();
connectDB();

app.get("/", (req, res) => {
    res.send("PostgreSQL server is online")
});

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
});