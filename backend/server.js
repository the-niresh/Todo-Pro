import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import todoRoutes from "./routes/todo.routes.js"
import connectMongoDB from "./config/db.js";
import notificationRoutes from "./routes/notification.routes.js";
import teamRoutes from "./routes/team.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectMongoDB();

const allowOrigins = ["http://localhost:5173"]

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({ origin: allowOrigins, credentials: true }));

// ROUTES-api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRoutes);

// LISTEN
app.listen(5000, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
