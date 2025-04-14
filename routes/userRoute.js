import express from "express";
import {
  deleteUser,
  getOneUser,
  getUser,
  loginUser,
  postUser,
  sendOtpEmail,
  updateUserIsBlock,
  verifyUserEmail,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.delete("/:email", deleteUser);
userRouter.get("/getall", getUser);
userRouter.post("/login", loginUser);
userRouter.get("/getuser", getOneUser);
userRouter.put("/:email", updateUserIsBlock);
userRouter.post("/verifyemail", verifyUserEmail);

export default userRouter;
