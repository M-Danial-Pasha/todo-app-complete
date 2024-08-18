import { User } from "../models/user.model"

class UserService {

    //Create User
    static async createUser (data) {
        return await User.create(data)
    }

    //Get User by id
    static async getUserById(id) {
        return await User.findById(id).select('-password');
    }

    //Get User by email
    static async getUserByEmail(email) {
        return await User.findOne({ email }).select("-password");
    }

}

export default new UserService();