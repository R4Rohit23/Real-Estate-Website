import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/auth.route.js";
const app = express();

app.use(express.json());

// Middleware to handle errors
app.use((err, req, res, next) => {
  const responseData = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  };
  res.json(responseData);
});

// connecting to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// defining routers for endpoints
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
