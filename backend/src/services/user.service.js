import { User } from "../models/user.model.js"

export default class UserService {

    constructor(){}

    //Create User
    static createUser = async (data) => {
        return await User.create(data)
    }

    //Get User by id
    static getUserById = async (id) => {
        return await User.findById(id).select('-password');
    }

    //Get User by email
    static getUserByEmail = async (email) => {
        return await User.findOne({ email }).select("-password");
    }

}