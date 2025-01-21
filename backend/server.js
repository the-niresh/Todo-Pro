import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ROUTES
// app.use("/api/auth", authRoutes);

// LISTEN
app.listen(5000, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
