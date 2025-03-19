import express from "express";
import {
  deleteGalleryItem,
  getImageGallery,
  postGalleryItems,
  updateGalley,
} from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", postGalleryItems);
galleryItemRouter.get("/", getImageGallery);
galleryItemRouter.delete("/:id", deleteGalleryItem);
galleryItemRouter.put("/:id", updateGalley);

export default galleryItemRouter;
