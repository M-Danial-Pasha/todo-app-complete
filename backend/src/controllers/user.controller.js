import { asyncHandler } from "../utils/AsyncHandler"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import StatusCodes from "http-status-codes";
import UserService from "../services/user.service";
import { hashPassword } from "../utils/Hash";

//Sign Up User
const signUp = asyncHandler( async (req, res) => {

    const { userName, email, password } = req.body;

    if(
        [userName, email, password].map((val) => val?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing Required Fields");
    }

    const isUserAlreadyExists = await UserService.getUserByEmail(email);

    if(isUserAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "User with this email already exists");
    }

    const response = await hashPassword(password);

    const data = {
        'user_name': userName,
        email,
        password: response.hashedPassword,
    }

    const newUser = await UserService.createUser(data);

    const getNewUser = await UserService.getUserById(newUser._id);

    if(!getNewUser) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }

    return res
    .status(StatusCodes.CREATED)
    .json(
        new ApiResponse(StatusCodes.CREATED, getNewUser, "User account has been created")
    );

});

//Login User
const login = asyncHandler( async (req, res) => {});

export {
    signUp,
    login
}