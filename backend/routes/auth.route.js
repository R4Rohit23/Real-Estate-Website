import express, { json } from "express";
import User from "../models/user.model.js";
const router = express.Router();
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
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
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credential" });
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

export default router;
