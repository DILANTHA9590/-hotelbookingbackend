import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoombyId,
  getRooms,
  getRoomsCustomers,
  updateRoomAvailbleStatus,
  updateRoomDetails,
} from "../controllers/roomsController.js";

const roomRouter = express.Router();

roomRouter.get("/category", getRoomsCustomers);
roomRouter.post("/", createRoom);
roomRouter.post("/getall", getRooms);
roomRouter.put("/:roomId", updateRoomDetails);
roomRouter.delete("/:roomId", deleteRoom);
roomRouter.get("/:roomId", getRoombyId);
roomRouter.post("/:roomId", updateRoomAvailbleStatus);

export default roomRouter;
