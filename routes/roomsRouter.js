import express from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoomDetails,
} from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getRooms);
roomRouter.put("/:roomId", updateRoomDetails);
roomRouter.delete("/:roomId", deleteRoom);

export default roomRouter;
