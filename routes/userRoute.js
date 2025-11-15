import express from "express";
import rateLimit from "express-rate-limit";
import {
  deleteUser,
  getCurrentUser,
  getOneUser,
  getUser,
  loginUser,
  postUser,
  sendOtpEmail,
  updateUserIsBlock,
  verifyUserEmail,
} from "../controllers/userControllers.js";

// Login limiter - strict
const loginLimiter = rateLimit({
  windowMs: 10, // 1 minute
  max: 5, // 5 login attempts / minute
  message: "Too many login attempts. Try in 1 minute.",
});

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.delete("/:email", deleteUser);
userRouter.get("/getall", getUser);
userRouter.post("/login", loginLimiter, loginUser);
userRouter.get("/getuser", getOneUser);
userRouter.put("/:email", updateUserIsBlock);
userRouter.post("/verifyemail", verifyUserEmail);
userRouter.get("/getcurrentuser", getCurrentUser);

export default userRouter;
