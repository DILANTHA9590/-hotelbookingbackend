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
  console.log(req.header);
  try {
    const galleryList = await GalleryItem.find();

    res.status(200).json({
      galleryList,
    });
  } catch (error) {
    res.json({
      message: "An error occurred while get the gallery item.",
      error: error.message,
    });
  }
}
