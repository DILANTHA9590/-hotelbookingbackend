import express from "express";
import { createRoom } from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);

export default roomRouter;
