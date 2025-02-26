import express from "express";
import { getUser, postUser } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/", postUser);
userRouter.get("/", getUser);

export default userRouter;
