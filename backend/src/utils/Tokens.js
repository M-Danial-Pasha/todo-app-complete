import jwt from "jsonwebtoken";

export const generateUserAccessToken = (data) => {
    try {
        let token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });

        return token;
    } catch (error) {
        throw Error(`Something went wrong while generating token: ERROR => ${error}`)
    }
}

export const generateUserRefreshToken = (data) => {
    try {
        let token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });

        return token;
    } catch (error) {
        throw Error(`Something went wrong while generating refresh token: ERROR => ${error}`)
    }
}

export const decodeToken = (token) => {
    try {

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        return decodedToken;
        
    } catch (error) {
        throw Error(`Expired Token`)
    }
}

export const decodeRefreshToken = (token) => {
    try {

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        return decodedToken;
        
    } catch (error) {
        throw Error(`Expired Token`)
    }
}