import e from "express";
import Booking from "../models/booking.js";
import { checkIsAdmin, checkIsCustomer } from "./userControllers.js";
import Room from "../models/room.js";

export async function createBooking(req, res) {
  try {
    if (!checkIsCustomer(req)) {
      return res.status(403).json({
        message: "Please log in to Customer continue with your booking.",
      });
    }

    const orderCount = await Booking.countDocuments({}).exec();
    console.log(orderCount);
    const prefix = "INV";
    let orderId;

    if (orderCount === 0) {
      orderId = prefix + 1001;
    } else {
      orderId = prefix + (1001 + orderCount);
    }
    // const email = req.user.email;

    // const bookingData = req.body;
    // bookingData.bookingId = orderId;

    // bookingData.email = email;

    const bookingData = {
      ...req.body,
      bookingId: orderId,
      email: req.user.email,
    };

    const newBooking = new Booking(bookingData);

    await newBooking.save();

    res.status(200).json({
      message: "Booking created succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again",
      error: error.message,
    });
  }
}

//this not good⛔⛔⛔⛔⛔⛔⛔⛔⛔
//methana e userge email eka ganna haduve na thama
export async function getAllBookings(req, res) {
  try {
    if (!checkIsAdmin(req) && !checkIsCustomer(req)) {
      res.status(403).json({
        message: "Unautherized access please login validate user",
      });
    }
    if (req.user.type == "admin") {
      const bookingData = await Booking.find();
      res.status(200).json({
        message: "Booking data retriving succesfully",
        bookings: bookingData,
      });
    } else {
      if (req.user.type == "customer") {
        const bookingData = await Booking.find({ email: req.user.email });

        if (bookingData.length === 0) {
          return res.status(404).json({
            message: "booking not found",
          });
        }
        res.status(200).json({
          bookings: bookingData,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function updateBookingDetails(req, res) {
  try {
    if (!checkIsAdmin(req) && !checkIsCustomer(req)) {
      return res.status(403).json({
        message: "Please log in to continue with your booking.",
      });
    }

    const bookingId = req.params.bookingId;

    console.log(bookingId);
    const bookingData = req.body;

    const ishave = await Booking.findOne({ bookingId: bookingId });

    if (!ishave) {
      return res.status(404).json({
        message:
          "Booking not found. Please check the booking ID and try again.",
      });
    }

    await Booking.updateOne({ bookingId: bookingId }, bookingData);

    res.status(200).json({
      message: "Booking updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: " something went  wrong ,please try again",
      error: error.message,
    });
  }
}

export async function deleteBooking(req, res) {
  try {
    console.log(req.params.bookingId);
    if (!checkIsAdmin(req)) {
      res.status(403).json({
        message: " Unautherized Access. please login to admin account",
      });
    }

    const bookingId = req.params.bookingId;

    const checkIsHave = await Booking.findOne({ bookingId: bookingId });
    console.log(checkIsHave);

    if (!checkIsHave) {
      res.status(404).json({
        message: "Booing id not found",
      });
    } else {
      await Booking.deleteOne({ bookingId: bookingId });

      res.status(200).json({
        message: "Deleted sucssesfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again",
      error: error.message,
    });
  }
}

export async function updateBookingStatus(req, res) {
  console.log("run");
  try {
    if (!checkIsAdmin) {
      return res.status(403).json({
        message: "Unautherized Access. please login to admin account",
      });
    }

    const ishave = await Booking.findOne({ bookingId: req.params.bookingId });

    if (!ishave) {
      res.status(404).status({
        message: " Booking id not found",
      });
    } else {
      const updateStatus = req.body;
      console.log(req.body);
      await Booking.updateOne(
        { bookingId: req.params.bookingId },
        updateStatus
      );
      console.log("inside this");

      res.status(200).json({
        message: " update Successfully",
      });
    }
  } catch (error) {
    res.status.json({
      message: "Something went a wrong please try again",
      message: error.message,
    });
  }
}

export default async function retrieveBookingByDate(req, res) {
  try {
    const start = req.body.start;
    const end = req.body.end;

    const result = await Booking.find({
      start: {
        $gte: start,
      },

      end: {
        $lt: new Date(end),
      },
    });

    res.status(200).json({
      message: "Filtered Bookings",
      result: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went a wrong please try again",
      message: error.message,
    });
  }
}

export async function createBookingUsingCategory(req, res) {
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);
  try {
    const availableBookings = await Booking.find({
      $or: [
        {
          start: {
            $gte: start,
            $lt: end,
          },
        },

        {
          end: {
            $gt: start,
            $lte: end,
          },
        },
      ],
    });

    if (availableBookings.length == 0) {
      return res.status(200).json({
        message: "",
      });
    }

    // console.log(availableBookings);

    // const bookingRoomId = [];

    // for (let i = 0; i < availableBookings.length; i++) {
    //   bookingRoomId[i] = availableBookings.roomId[i];
    // }
    const bookingRoomId = availableBookings.map((rooms) => rooms.roomId);
    console.log(bookingRoomId);

    const rooms = Room.find({
      roomId: {
        // we get bookin unavaible rooms
        $nin: bookingRoomId,
      },
      category: req.body.category,
    });
    if (rooms.length == 0) {
      res.status(200).json({
        message: "Sorry! No rooms available for your chosen dates 😔",
      });
    } else {
      const orderCount = await Booking.countDocuments({}).exec();
      console.log(orderCount);
      const prefix = "INV";
      let orderId;

      if (orderCount === 0) {
        orderId = prefix + 1001;
      } else {
        orderId = prefix + (1001 + orderCount);
      }
      // const email = req.user.email;

      // const bookingData = req.body;
      // bookingData.bookingId = orderId;

      // bookingData.email = email;

      const bookingData = {
        ...req.body,
        bookingId: orderId,
        roomId: rooms[0].roomId,
        email: req.user.email,
        start: start,
        end: end,
      };
      const newBooking = new Booking(bookingData);

      await newBooking.save();

      res.status(200).json({
        message: "Booking created succesfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
