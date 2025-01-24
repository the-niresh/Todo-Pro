import Notification from "../models/notification.model.js";
import Team from "../models/team.model.js";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createTodo = async (req, res) => {
	try {
		const { title, description, status, } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!title) {
			return res.status(400).json({ error: "A Todo should at least have a title" });
		}
		if (!status) {
			return res.status(400).json({ error: "Add status" });
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
			owner: userId,
		});

		await newTodo.save();
		res.status(201).json(newTodo);
	} catch (error) {
        console.log("Error in createTodo controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteTodo = async (req, res) => {
	const userId = req.user._id.toString();
	const { teamId } = req.params;
	
	try {
		const todo = await Todo.findById(req.params.todoId);

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		const isAdmin = await Team.findOne({ _id: teamId, admins: userId });
		
		if (todo.owner.toString() !== userId || !isAdmin) {
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
	const { title, description, status, due, owner, team } = req.body;
	let { img } = req.body;
	const userId = req.user._id.toString();
	const todoId = req.params.todoId;
  
	console.log("---todoId", todoId);
  
	try {
	  let todo = await Todo.findById(todoId);
	  if (!todo) {
		return res.status(404).json({ error: "Todo not found" });
	  }
  
	  // Check if the user is the owner of the todo before updating
	  if (todo.owner.toString() !== userId) {
		return res.status(401).json({ error: "You are not authorized to update this todo" });
	  }
  
	  if (!title) {
		return res.status(400).json({ error: "Title field is required" });
	  }
  
	  let ownerChanged = false;
	  if (owner && todo.owner.toString() !== owner.toString()) {
		ownerChanged = true;
		todo.owner = owner;
	  }
  
	  if (img) {
		if (todo.img) {
		  await cloudinary.uploader.destroy(todo.img.split("/").pop().split(".")[0]);
		}
		const uploadedResponse = await cloudinary.uploader.upload(img);
		img = uploadedResponse.secure_url;
	  }
  
	  todo.title = title || todo.title;
	  todo.description = description || todo.description;
	  todo.status = status || todo.status;
	  todo.due = due || todo.due;
	  todo.img = img || todo.img;
  
	  todo = await todo.save();
  
	  // notify about task update
	  const taskUpdatedNotification = new Notification({
		type: "task_updated",
		todo: todoId,
		title: todo.title,
	  });
	  await taskUpdatedNotification.save();
  
	  // NNotify the owner changed
	  if (ownerChanged) {
		const ownerChangedNotification = new Notification({
		  type: "owner_changed",
		  todo: todoId,
		  title: todo.title,
		  newOwner: owner,
		});
		await ownerChangedNotification.save();
	  }
  
	  return res.status(200).json({ success: true, todo });
	} catch (error) {
	  console.log("Error in editTodo:", error);
	  return res.status(500).json({ error: error.message });
	}
  };
  
  export const getAllTodos = async (req, res) => {
	try {
		const todo = await Todo.find().sort({ createdAt: -1 })
			// .populate({
			// 	path: "user",
			// 	select: "-password",
			// })
			// .populate({
			// 	path: "comments.user",
			// 	select: "-password",
			// });

		if (todo.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(todo);
	} catch (error) {
		console.log("Error in getAllTodos controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getOneTodo = async (req, res) => {
	try {
		const { todoId } = req.params;

		const todo = await Todo.findOne({ _id: todoId });
		if (!todo) return res.status(404).json({ error: "Todo not found" });

		const todos = await Todo.find({ todo: todo._id })
			.sort({ createdAt: -1 })

		res.status(200).json(todo);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
