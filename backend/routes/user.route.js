import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

const router = express.Router();

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Credential" });
  }

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
    return res
      .staus(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Credential" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res
      .staus(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getUserListings = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Credential" });
  }

  try {
    const listing = await Listing.find({ userRef: req.params.id });
    return res.status(200).json(listing);
  } catch (error) {
    return res
      .status(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Both the function will be run on the POST request on the /update endpoint
router.post("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listing/:id", verifyToken, getUserListings);

export default router;
