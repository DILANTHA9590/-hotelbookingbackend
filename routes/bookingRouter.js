import express from "express";
import retrieveBookingByDate, {
  createBooking,
  createBookingUsingCategory,
  deleteBooking,
  getAllBookings,
  updateBookingDetails,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const bookingrouter = express.Router();

bookingrouter.post("/", createBooking);
bookingrouter.get("/", getAllBookings);
bookingrouter.delete("/:bookingId", deleteBooking);
bookingrouter.put("/status/:bookingId", updateBookingStatus);
bookingrouter.put("/:bookingId", updateBookingDetails);
bookingrouter.post("/filteredbooking", retrieveBookingByDate);
bookingrouter.post("/createbycategory", createBookingUsingCategory);

export default bookingrouter;
