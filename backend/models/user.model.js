import mongoose from "mongoose";

// Degining a schema for "user" model
const userSchema = new mongoose.Schema(
  {
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
    avatar: {
      type: String, 
      default:
        "https://imgs.search.brave.com/azHJXpHa7PgtfkCslA9iN6uQvT1hLT_p3tTB44QwDoI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9oLW8t/bS1lLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMi8wNC9C/bGFuay1Qcm9maWxl/LVBpY3R1cmUtMC5q/cGc",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
