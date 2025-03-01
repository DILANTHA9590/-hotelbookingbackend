import Room from "../models/room.js";
import { checkIsAdmin } from "./userControllers.js";

export async function createRoom(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: "  Unautherized Access, Please Login Admin Account",
      });
    }
    const createRoom = req.body;
    console.log("myroom", createRoom);

    const isRoomHave = await Room.findOne({ roomId: createRoom.roomId });

    if (isRoomHave) {
      return res.status(409).json({
        message: " this room already have ",
      });
    }

    const newRoom = await new Room(createRoom);

    newRoom.save();

    res.status(200).json({
      message: " Room created successfull!",
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function updateRoomDetails(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: "  Unautherized Access, Please Login Admin Account",
      });
    }

    const updateRoomId = req.params.roomId;
    const updateRoomData = req.body;

    const room = await Room.findOne({ roomId: updateRoomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    console.log("insideparams roomId", updateRoomId);
    console.log("inside room update data", updateRoomData);

    await Room.updateOne({ roomId: updateRoomId }, updateRoomData);

    res.status(200).json({
      message: " Room updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function getRooms(req, res) {
  try {
    const roomList = await Room.find();

    res.status(200).json({
      message: "Data retrieved successfully.",
      rooms: roomList,
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function deleteRoom(req, res) {
  try {
    if (!checkIsAdmin) {
      return res.status(403).json({
        message: "  Unautherized Access, Please Login Admin Account",
      });
    }

    const roomId = req.params.roomId;
    console.log("params inside id", roomId);
    const checkIsHave = await Room.findOne({ roomId: roomId });

    if (!checkIsHave) {
      return res.status(404).json({
        message: "Room is not found",
      });
    }

    await Room.deleteOne({ roomId: roomId });

    res.status(200).json({
      message: "Room Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again later",
      error: error.message,
    });
  }
}
