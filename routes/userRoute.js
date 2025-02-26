import express from "express";
import {
  getUser,
  loginUser,
  postUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.get("/", getUser);
userRouter.get("/login", loginUser);

export default userRouter;
