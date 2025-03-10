import Booking from "../models/booking.js";
import { checkIsAdmin, checkIsCustomer } from "./userControllers.js";

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
