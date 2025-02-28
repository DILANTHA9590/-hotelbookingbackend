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
