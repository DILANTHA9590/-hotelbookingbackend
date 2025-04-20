import Booking from "../models/booking.js";
import Room from "../models/room.js";
import bookingrouter from "../routes/bookingRouter.js";
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
    if (!checkIsAdmin(req)) {
      res.status(403).json({
        message: "Unautherized access",
      });
    }

    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    console.log(page);
    console.log(pageSize);

    // Calculate the number of documents to skip
    const skip = (page - 1) * pageSize;

    // Fetch users with pagination
    const rooms = await Room.find().skip(skip).limit(pageSize);
    const totalRooms = await Room.countDocuments(); // Get total user count
    console.log(rooms);
    console.log(totalRooms);

    res.status(200).json({
      message: "Fetching data successfully",
      rooms,
      pagination: {
        curruntPage: page,
        pageSize,
        totalRooms,
        totalPages: Math.ceil(totalRooms / pageSize),
      },
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

export async function getRoomsCustomers(req, res) {
  try {
    const category = req.query.category;
    console.log(category);
    const rooms = await Room.find({ category: category, available: true });

    res.status(200).json({
      message: `Category '${category}' data retrieved successfully.`,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went a wrong Please try again",
      message: error.message,
    });
  }
}

export async function getRoombyId(req, res) {
  try {
    const roomId = req.params.roomId;

    const roomsData = await Room.findOne({ roomId });

    if (!roomId) {
      res.status(404).json({
        message: `${roomId} Room is not found`,
      });
    } else {
      res.status(200).json({
        message: "Room data retrieved successfully ",
        roomsData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function updateRoomAvailbleStatus(req, res) {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({
        message: "please login to Admin account",
      });
    }
    const available = req.body.update;
    const roomId = req.params.roomId;

    const updateRooms = await Room.findOneAndUpdate(
      { roomId: roomId },
      { available: available },
      { new: true }
    );

    if (!updateRooms) {
      return res.status(404).json({
        message: `This ${roomId} not found`,
      });
    }

    const updateBooking = await Booking.findOneAndUpdate(
      { roomId: roomId },
      { available: available },
      { new: true }
    );

    if (!updateBooking) {
      return res.status(404).json({
        message: `⚠️ Room updated, but booking not found for room ID '${roomId}'`,
      });
    }

    return res.status(200).json({
      message: `✅ Room and booking availability updated successfully!`,
    });
  } catch (error) {
    res.status(500).json({
      message: "🚨 Something went wrong! Please try again later.",
      error: error.message,
    });
  }
}
