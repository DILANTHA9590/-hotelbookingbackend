import CategoryItem from "../models/category.js";
import { checkIsAdmin } from "./userControllers.js";

export async function createCategory(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      res.status(403).json({
        message: " Unautherized Access, Please Login Admin Account ",
      });
    }
    const checkIsHave = await CategoryItem.findOne({ name: req.body.name });
    if (checkIsHave) {
      return res.status(409).json({
        message: "This category is allready have",
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

export async function deleteCategory(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: " Unautherized Access, Please Login Admin Account ",
      });
    }
    const checkIsHave = await CategoryItem.findOne({ name: req.params.name });
    if (!checkIsHave) {
      return res.status(409).json({
        message: "this is not have database",
      });
    }

    await CategoryItem.deleteOne({ name: req.params.name });
    res.status(200).json({
      message: " Category item Delete successfully",
    });
  } catch (error) {
    res.json({
      message: "Something went a wrong Please try again",
      error: error.message,
    });
  }
}

// export async function updateCategory(req,res){

// }
