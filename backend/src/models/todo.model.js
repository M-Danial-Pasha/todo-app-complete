// This is the User Schema file
import mongoose, {Schema} from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            min: 3,
            trim: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["PENDING", "IN-PROGRESS", "DONE"],
            default: "PENDING",
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);