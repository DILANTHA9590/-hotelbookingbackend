import GalleryItem from "../models/galleryItems.js";
import { checkIsAdmin } from "./userControllers.js";

// create galle6y item

export async function postGalleryItems(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      res.status(403).json({
        message: "Unautherized Access. Please Login to admin account",
      });
      return;
    }

    const newGalleryItem = new GalleryItem(req.body);
    await newGalleryItem.save();

    res.status(200).json({
      message: "Gallery item created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the gallery item.",
      error: error.message,
    });
  }
}

export async function getImageGallery(req, res) {
  try {
    const galleryList = await GalleryItem.find();

    res.status(200).json({
      gallery: galleryList,
    });
  } catch (error) {
    res.json({
      message: "An error occurred while get the gallery item.",
      error: error.message,
    });
  }
}

export async function deleteGalleryItem(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: "Unautherized Access. Please Login to admin account",
      });
    }

    const checkIsHave = await GalleryItem.findOne({ _id: req.params.id });

    if (!checkIsHave) {
      return res.status(404).json({
        message: "Gallery Item Not found",
      });
    }

    await GalleryItem.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Some thing went a wrong please try again",
      error: error.message,
    });
  }
}

export async function updateGalley(req, res) {
  if (!checkIsAdmin(req)) {
    return res.status(200).json({
      message: "Unautherized Access",
    });
  }

  try {
    const checkIsHave = await GalleryItem.findOne({ _id: req.params.id });
    if (!checkIsHave) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }
    const galleryData = req.body;
    await GalleryItem.updateOne({ _id: req.params.id }, galleryData);

    res.status(200).json({
      message: "Gallery Item Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Some thing went a wrong please try again",
      Error: error.message,
    });
  }
}
