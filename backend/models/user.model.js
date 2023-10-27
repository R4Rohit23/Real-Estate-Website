import mongoose from "mongoose";

// Degining a schema for "user" model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;