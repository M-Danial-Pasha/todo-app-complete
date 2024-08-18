import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import StatusCodes from "http-status-codes";
import { decodeToken } from "../utils/Tokens.js";
import UserService from "../services/user.service.js";

const checkAuth = asyncHandler( async (req, res, next) => {

    try {
        //Getting the token from the Request object
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "User not logged in.");
        }

        //Decoding the token
        const decodedToken = decodeToken(token);
        
        //Fetching the user based on user's id
        const user = await UserService.getUserById(decodedToken._id);

        //Setting the user object onto the request object
        req.user = user;

        //Calling the next function
        next();

    } catch (error) {
        if(error.message === 'Expired Token') {
            throw new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        } else if (error.message === 'User not logged in.') {
            throw new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        } else {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
        }
    }

});


export default checkAuth;