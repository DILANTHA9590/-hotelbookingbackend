import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryItems,
  getCategoryName,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getCategoryItems);
categoryRouter.get("/:name", getCategoryName);

categoryRouter.delete("/:name", deleteCategory);

export default categoryRouter;
