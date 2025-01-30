import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/auth.routes.js"
import todoRoutes from "./routes/todo.routes.js"
import connectMongoDB from "./config/db.js";
import notificationRoutes from "./routes/notification.routes.js";
import teamRoutes from "./routes/team.routes.js";
import userRoutes from "./routes/user.routes.js";

const allowOrigins = [process.env.VITE_FRONTEND_URL]
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(cors({ origin: allowOrigins, credentials: true }));

connectMongoDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ROUTES-api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/user", userRoutes);

// socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
  allowEIO3: true
});

// Handle Socket.IO Connections
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Broadcast real-time todos update
  socket.on("updateTodos", (updatedTodos) => {
    io.emit("todosUpdated", updatedTodos);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});