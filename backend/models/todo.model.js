import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    status: { type: String },
    due: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Todo", required: true },
	team: { type: String, required: true }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
