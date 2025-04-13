import express from "express";
import { createstudent, getStudent } from "../controllers/StudentController.js";
const StudentRouter = express.Router();

StudentRouter.post("/", createstudent);
StudentRouter.get("/", getStudent);

export default StudentRouter;
