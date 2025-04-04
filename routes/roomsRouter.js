import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoombyId,
  getRooms,
  getRoomsCustomers,
  updateRoomDetails,
} from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.get("/category", getRoomsCustomers);
roomRouter.post("/", createRoom);
roomRouter.post("/getall", getRooms);
roomRouter.put("/:roomId", updateRoomDetails);
roomRouter.delete("/:roomId", deleteRoom);
roomRouter.get("/:roomId", getRoombyId);

export default roomRouter;
