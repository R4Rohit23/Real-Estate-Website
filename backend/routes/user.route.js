import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

const router = express.Router();

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json("Invalid Credential!");

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

// Both the function will be run on the POST request on the /update endpoint
router.post("/update/:id", verifyToken, updateUser);

export default router;
