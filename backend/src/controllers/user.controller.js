import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StatusCodes from "http-status-codes";
import UserService from "../services/user.service.js";
import { hashPassword, comparePassword } from "../utils/Hash.js";
import { generateUserAccessToken, generateUserRefreshToken } from "../utils/Tokens.js";

//Sign Up User
const signUp = asyncHandler( async (req, res) => {

    const { userName, email, password } = req.body;

    console.log('Body: ', req.body);
    
    //Basic data validation
    if(
        [userName, email, password].some((field) => field?.trim() === "")
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

    //Getting the newly created User
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
const login = asyncHandler( async (req, res) => {

    const { email, password } = req.body;

    // Basic data validation
    if(
        [email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email and Password is required");
    }

    //Checking if user exists
    const isUserExists = await UserService.getFullUserByEmail(email);

    if(!isUserExists) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User with this email does not exists");
    }

    //Checking if user's password is correct
    const isPasswordCorrect = await comparePassword(password, isUserExists.password);

    if(!isPasswordCorrect) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user credentials.");
    }

    const user = await UserService.getUserByEmail(email);

    //Creating Payload for Access Token
    const payloadForAccessToken = {
        _id: user._id,
        email: user.email,
        isActive: user.is_active,
        userName: user.user_name
    }

    //Creating Payload for Refresh Token
    const payloadForRefreshToken = {
        _id: user._id
    }

    //Generating Access & Refresh Tokens
    const accessToken = generateUserAccessToken(payloadForAccessToken);
    const refreshToken = generateUserRefreshToken(payloadForRefreshToken);

    //Saving the refresh token to user object
    user.refresh_token = refreshToken;
    user.save();
    
    //Creating Response data object
    const responseData = {
        user: user,
        accessToken: accessToken
    }

    //Creating Cookies Options
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(StatusCodes.OK, responseData, "User successfully logged in.")
    )
});

//Logout User
const logout = asyncHandler( async (req, res) => {

    const loggedInUser = req?.user;

    if(!loggedInUser) {
        throw new ApiError(StatusCodes.FORBIDDEN, "No user logged in");
    }

    loggedInUser.refresh_token = "";
    loggedInUser.save();

    //Creating Cookies Options
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(StatusCodes.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(StatusCodes.OK, {}, "User logged out successfully.")
    )

});

//Get Current Logged In User
const getMe = asyncHandler( async (req, res) => {

    const currentUser = req?.user;

    if(!currentUser) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "No user logged in.");
    }

    return res
    .status(StatusCodes.OK)
    .json(
        new ApiResponse(StatusCodes.OK, currentUser, "Current user fetched successfully")
    );

});

export {
    signUp,
    login,
    logout,
    getMe
}