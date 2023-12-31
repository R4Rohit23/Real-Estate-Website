import express, { json } from "express";
import User from "../models/user.model.js";
const router = express.Router();
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
    res.status(550).json({ success: false, message: "Account already exists" });
  }
});

// SIGN-IN Router
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credential" });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // This is an object destructuring pattern. It means you want to extract the password property from validUser._doc and assign it to a variable named pass. The ...rest part is using the spread operator to collect all the remaining properties of validUser._doc into an object named rest.

    // In Mongoose, for example, the ._doc property is a way to access the underlying plain JavaScript object representation of a MongoDB document (a record in a collection). MongoDB documents are typically represented as JavaScript objects with additional methods and properties added by the database library.

    // Here's how it works in the context of Mongoose:

    // (1) When you query the database using Mongoose, you receive Mongoose documents by default. These documents are not plain JavaScript objects, but they have additional methods and properties provided by Mongoose.

    // (2) If you want to work with the raw, plain JavaScript object representation of the document, you can access it using the ._doc property.

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    console.log(err);
  }
});

// Google OAuth Router
router.post("/google", async (req, res) => {
  try {
    // check if user is present or not
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // if user is not present then generate any random password and randwom username and register that user into our database
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      console.log(newUser);

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error Creating User" });
    console.log(error);
  }
});

// SignOut Router
router.get("/signout", async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "User Has been Signed out" });
  } catch (error) {
    res.status(501).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
