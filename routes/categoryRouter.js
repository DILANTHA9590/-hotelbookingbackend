import express from "express";
import { createCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

export default categoryRouter;
