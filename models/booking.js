import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },

  roomId: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },

  notes: {
    type: String,
    default: "",
  },

  timeStamps: {
    type: Date,
    default: Date.now,
  },

  available: {
    type: Boolean,
    default: false,
  },
  expired: {
    type: Boolean,
    default: false,
  },
});

const Booking = mongoose.model("Bookings", bookingSchema);

export default Booking;
