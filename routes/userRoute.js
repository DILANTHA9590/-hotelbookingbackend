import express from "express";
import {
  getOneUser,
  getUser,
  loginUser,
  postUser,
  updateUserIsBlock,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.get("/", getUser);
userRouter.post("/login", loginUser);
userRouter.post("/getUser", getOneUser);
userRouter.put("/:email", updateUserIsBlock);

export default userRouter;
