import express from "express";
import {
  createRoom,
  getRooms,
  updateRoomDetails,
} from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getRooms);
roomRouter.put("/:roomId", updateRoomDetails);

export default roomRouter;
