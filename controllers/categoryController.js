import CategoryItem from "../models/category.js";
import { checkIsAdmin } from "./userControllers.js";

export async function createCategory(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      res.status(403).json({
        message: " Unautherized Access, Please Login Admin Account ",
      });
    }

    const newCategoryItem = await new CategoryItem(req.body);

    newCategoryItem.save();

    res.json({
      message: "Category item created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: " Gallery item create fail !",
      error: error.message,
    });
  }
}
