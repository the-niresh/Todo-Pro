import Notification from "../models/notification.model.js";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createTodo = async (req, res) => {
	try {
		const { title,description,status, } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!title) {
			return res.status(400).json({ error: "A Todo should at least have a title" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newTodo = new Todo({
            title,
            description,
            img,
            status,
			user: userId,
		});

		await newTodo.save();
		res.status(201).json(newTodo);
	} catch (error) {
        console.log("Error in createTodo controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteTodo = async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);
		console.log("req,params",req.params)
		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		if (todo.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this todo" });
		}

		if (todo.img) {
			const imgId = todo.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Todo.findByIdAndDelete(req.params.id);

		res.status(200).json({ success: true, message: "Todo deleted successfully" });
	} catch (error) {
		console.log("Error in deleteTodo controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const editTodo = async (req, res) => {
	const { title, description, status, due, user, team } = req.body;
	let { img } = req.body;
	const userId = req.user._id;

	const todoID = req.params.id;
	console.log("---todoID",todoID)

	try {
		let todo = await Todo.findById(todoID);
		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		if (todo.user.toString() !== userId.toString()) {
			return res.status(401).json({ error: "You are not authorized to update this todo" });
		}

		if (!title) {
			return res.status(400).json({ error: "title field is required" });
		}

		if (img) {
			if (user.img) {
				// reference URL = https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.img.split("/").pop().split(".")[0]);
			}
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		todo.title = title || todo.title;
		todo.description = description || todo.description;
		todo.status = status || todo.status;
		todo.due = due || todo.due;
		todo.img = img || todo.img;

		// notify the person
		const newNotification = new Notification({
			type: "task_updated",
			task: todoID,
			title: todo.title
		})

		todo = await newNotification.save();
		return res.status(200).json(todo);
	} catch (error) {
		console.log("Error in editTodo: ", error);
		return res.status(500).json({ error: error.message });
	}
}
