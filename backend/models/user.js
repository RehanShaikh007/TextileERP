import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['owner', 'manager', 'sales', 'inventory head'],
            default: 'owner'
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
