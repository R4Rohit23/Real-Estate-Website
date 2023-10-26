import express from "express";
import User from "../models/user.model.js";
const router = express.Router();
import bcryptjs from "bcryptjs";

// SIGN-UP Router
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  // Encrypting the password
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
