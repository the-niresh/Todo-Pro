import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createTodo, deleteTodo, editTodo } from "../controllers/todo.controller.js";

const todoRoutes = express.Router();

todoRoutes.post("/create", protectRoute, createTodo);
todoRoutes.delete("/:id", protectRoute, deleteTodo);
todoRoutes.post("/edit/:id", protectRoute, editTodo);

export default todoRoutes;