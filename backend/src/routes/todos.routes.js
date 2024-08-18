import { Router } from "express";

import { createTodo, updateTodo, deleteTodo, getAllUserTodos } from "../controllers/todo.controller.js";
import { checkAuth } from "../middlewares/index.js" 

const router = Router();

//Authorized Routes
router.route('/create').post(checkAuth, createTodo);
router.route('/update').patch(checkAuth, updateTodo);
router.route('/delete').delete(checkAuth, deleteTodo);
router.route('/get-user-todos').get(checkAuth, getAllUserTodos);

export default router;