import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const todoSchema = mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
        },
        name: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        }
    },
    { timestamps: true },
);

const Todo = mongoose.model("TODO", todoSchema);

export default Todo;