import { Todo } from "../models/todo.model.js"
import { NO_OF_DOCS_PER_PAGE } from "../utils/Constants.js";

export default class TodoService {

    constructor(){}

    //Create New Todo
    static createTodo = async (data) => {
        return await Todo.create(data);
    }

    //Update Todo
    static updateTodo = async (todoId, updatedData) => {
        return await Todo.findByIdAndUpdate(todoId, {
            $set: {
                title: updatedData.title,
                description: updatedData.description,
                status: updatedData.status
            }
        });
    }

    //Delete Todo
    static deleteTodo = async (todoId) => {
        return await Todo.findByIdAndDelete(todoId);
    }

    //Get User Todos
    static getUserAllTodos = async (userId, pageNo) => {
        let pageNum = pageNo;
        let totalUserTodos = await Todo.find({
            owner: userId
        }).countDocuments();
        let userTodos = await Todo.find({
            owner: userId
        })
        .skip(NO_OF_DOCS_PER_PAGE * pageNum)
        .limit(NO_OF_DOCS_PER_PAGE);

        return {
            totalTodos: totalUserTodos,
            todos: userTodos
        }
    }

}