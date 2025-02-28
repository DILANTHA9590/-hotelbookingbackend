import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryItems,
  getCategoryName,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

categoryRouter.get("/", getCategoryItems);
categoryRouter.put("/:name", updateCategory);
categoryRouter.get("/:name", getCategoryName);

categoryRouter.delete("/:name", deleteCategory);

export default categoryRouter;
