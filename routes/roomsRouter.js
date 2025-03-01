import express from "express";
import {
  createRoom,
  updateRoomDetails,
} from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.put("/:roomId", updateRoomDetails);

export default roomRouter;
