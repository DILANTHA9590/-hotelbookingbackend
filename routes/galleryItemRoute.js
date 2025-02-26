import express from "express";
import {
  getImageGallery,
  postGalleryItems,
} from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", postGalleryItems);
galleryItemRouter.get("/", getImageGallery);

export default galleryItemRouter;
