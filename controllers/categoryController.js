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
    res.status(500).json({
      message: "Something went a wrong Please try again",
      error: error.message,
    });
  }
}

export async function getCategoryItems(req, res) {
  try {
    const categoryItems = await CategoryItem.find();

    res.status(200).json({
      message: "Data retrieved successfully.",
      categories: categoryItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function getCategoryName(req, res) {
  try {
    const findCategory = await CategoryItem.findOne({ name: req.params.name });

    if (!findCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category: findCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "something wenet a wrong",
      message: error.message,
    });
  }
}

export async function updateCategory(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: " Unautherized Access, Please Login Admin Account ",
      });
    }

    const findCategory = await CategoryItem.findOne({ name: req.params.name });

    if (!findCategory) {
      return res.status(404).json({
        message: "Category not found!",
      });
    }

    const updateData = req.body;
    await CategoryItem.updateOne({ name: req.params.name }, updateData);

    res.status(200).json({
      message: "Category Item Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: " Some thing went a wrong please try again!",
      error: error.message,
    });
  }
}
