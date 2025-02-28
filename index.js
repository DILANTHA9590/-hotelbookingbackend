import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import jwt from "jsonwebtoken";
import categoryRouter from "./routes/categoryRouter.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

const CONNCETION_URL = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        // If token is invalid, send a 401 Unauthorized response
        return res.status(401).json({ message: "Unauthorized" });
      }

      // If token is valid, attach decoded data to req.user

      req.user = decoded;

      next(); // Continue to the next middleware/route handler
    });
  } else {
    // No token is present, just continue to the next middleware/route handler
    next();
  }
});

mongoose
  .connect(CONNCETION_URL)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log("Coonnection Error Occured", error);
  });

app.use("/api/users", userRouter);

app.use("/api/gallery", galleryItemRouter);

app.use("/api/catagories", categoryRouter);

// A simple route for the homepage

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
