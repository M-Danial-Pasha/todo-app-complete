import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StatusCodes from "http-status-codes";
import TodoService from "../services/todo.service.js";

//Create Todo
const createTodo = asyncHandler( async (req, res) => {

    const { title, description } = req.body;
    const user = req?.user;

    //Basic data validation
    if(
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Title and Description is required");
    }

    //New todo data
    const newTodoData = {
        title,
        description,
        owner: user?._id
    }

    //Creating new todo
    const newTodo = await TodoService.createTodo(newTodoData);

    if(!newTodo) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }

    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse(StatusCodes.CREATED, newTodo, "Todo created successfully.")
    );

});

//Update Todo
const updateTodo = asyncHandler( async (req, res) => {

    const { todoId, title, description, status } = req.body;

    //Basic data validation
    if(
        [todoId, title, description, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
    }

    const updatedTodo = await TodoService.updateTodo(todoId, {title, description, status});

    if(!updatedTodo) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong while updating the todo");
    }

    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse(StatusCodes.OK, updatedTodo, "Todo updated successfully.")
    );

});

//Delete Todo
const deleteTodo = asyncHandler( async (req, res) => {

    const { todoId } = req.body;

    //Basic data validation
    if(
        [todoId].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
    }

    await TodoService.deleteTodo(todoId);

    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse(StatusCodes.OK, {}, "Todo deleted successfully.")
    );


});

//Get User Todos
const getAllUserTodos = asyncHandler( async (req, res) => {

    const { pageNum } = req.body;
    const user = req?.user;

    const allUserTodos = await TodoService.getUserAllTodos(user._id, pageNum);

    if(!allUserTodos) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong while fetching user's todos");
    }


    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse(StatusCodes.OK, allUserTodos, "User's todos fetched successfully.")
    );

});

export {
    createTodo,
    updateTodo,
    deleteTodo,
    getAllUserTodos
}