import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import jwt, { decode } from "jsonwebtoken";

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

const CONNCETION_URL =
  "mongodb+srv://dilantha:95909982@cluster0.oepqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        console.log(decoded);

        next();
      }
    });
  } else {
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

// A simple route for the homepage

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
