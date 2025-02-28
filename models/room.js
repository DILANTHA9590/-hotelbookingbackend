import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  roomId: {
    type: Number,
    required: true,
    unique: true,
  },

  category: {
    type: String,
    required: true,
  },

  maxGuests: {
    type: Number,
    required: true,
  },

  available: {
    type: Boolean,

    required: true,

    default: true,
  },

  photos: [
    {
      type: String,
    },
  ],

  specialsDescriptions: {
    type: String,
    default: "",
  },

  notes: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model("Rooms", roomSchema);

export default Room;
