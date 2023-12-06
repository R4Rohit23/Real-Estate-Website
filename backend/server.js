import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
dotenv.config();
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());


// connecting to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

// defining routers for endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//hii
