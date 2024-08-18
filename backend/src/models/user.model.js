// This is the User Schema file
import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        user_name: {
            type: String,
            required: [true, "Username is required"],
            min: 3,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        refresh_token: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);