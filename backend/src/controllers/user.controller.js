import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StatusCodes from "http-status-codes";
import UserService from "../services/user.service.js";
import { hashPassword } from "../utils/Hash.js";

//Sign Up User
const signUp = asyncHandler( async (req, res) => {

    const { userName, email, password } = req.body;

    console.log('Body: ', req.body);
    
    //Basic data validation
    if(
        [userName, email, password].map((val) => val?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing Required Fields");
    }

    //Checking if user is already exists with that email
    const isUserAlreadyExists = await UserService.getUserByEmail(email);

    if(isUserAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "User with this email already exists");
    }

    //Hashing the password
    const response = await hashPassword(password);

    //Creating a data object for storing the data into DB
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