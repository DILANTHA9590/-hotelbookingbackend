import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  updateBookingDetails,
} from "../controllers/bookingController.js";

const bookingrouter = express.Router();

bookingrouter.post("/", createBooking);
bookingrouter.get("/", getAllBookings);
bookingrouter.delete("/:bookingId", deleteBooking);
bookingrouter.put("/:bookingId", updateBookingDetails);

export default bookingrouter;
