import express from "express";
import { getAllToDosController, updateTodoController, createTodoController, deleteTodoController } from "../controllers/todoControllers.js";

// Router to access TODO related routes
const todoRouter = express.Router();

// Routes

/**
 * @todoRouter /api/v1/todo/todos/:userId/:priority/:status
 * @description GET All Todos
 * @access public
 * @method GET
 */
todoRouter.get("/todos", getAllToDosController);


/**
 * @todoRouter /api/v1/todo/todos
 * @description Create A Todo
 * @access public
 * @method POST
 */
todoRouter.post("/todos", createTodoController);



/**
 * @todoRouter /api/v1/todo/todos
 * @description Update A Todo
 * @access public
 * @method PUT
 */
todoRouter.put("/todos", updateTodoController);



/**
 * @todoRouter /api/v1/todo/todos
 * @description Update A Todo
 * @access public
 * @method DELETE
 */
todoRouter.delete("/todos", deleteTodoController);




// Exporting Router
export default todoRouter;