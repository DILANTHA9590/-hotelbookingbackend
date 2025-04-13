import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  enrolled: {
    type: Boolean,
    required: true,
    default: true,
  },
  subjects: [
    {
      type: String,
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
