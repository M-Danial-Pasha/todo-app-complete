import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import StatusCodes from "http-status-codes";
import { decodeToken } from "../utils/Tokens.js";
import UserService from "../services/user.service.js";

const checkAuth = asyncHandler( async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "UnAuthorized");
        }

        const decodedToken = decodeToken(token);
        console.log(`==> Decoded Token: ${decodedToken}`);
        
        const user = await UserService.getUserById(decodedToken._id);

        req.user = user;

        next();

    } catch (error) {
        if(error.message === 'Expired Token') {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Token has been expired.");
        } else if (error.message === 'UnAuthorized') {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "UnAuthorized");
        } else {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
        }
    }

});


export default checkAuth;