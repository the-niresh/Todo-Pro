import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createTodo, deleteTodo, editTodo } from "../controllers/todo.controller.js";

const todoRoutes = express.Router();

todoRoutes.post("/create", protectRoute, createTodo);
todoRoutes.delete("/:teamId/:todoId", protectRoute, deleteTodo);
todoRoutes.post("/edit/:teamId/:todoId", protectRoute, editTodo);

export default todoRoutes;