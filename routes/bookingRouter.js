import express from "express";
import {
  createBooking,
  getAllBookings,
  updateBookingDetails,
} from "../controllers/bookingController.js";

const bookingrouter = express.Router();

bookingrouter.post("/", createBooking);
bookingrouter.get("/", getAllBookings);
bookingrouter.put("/:bookingId", updateBookingDetails);

export default bookingrouter;
