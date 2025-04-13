import Student from "../models/studentData.js";

export async function createstudent(req, res) {
  try {
    const studentData = req.body;

    const newStudent = await new Student(studentData);

    newStudent.save();

    res.status(200).json({
      meessage: "Student Saving succesfully",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getStudent(req, res) {
  console.log("run this");
  const search = req.query.search || "";
  try {
    const students = await Student.find({
      $or: [
        { name: { $regex: search, $options: "i" } }, // name match
        { age: isNaN(search) ? -1 : Number(search) }, // age match (number)
      ],
    });

    res.status(200).json({ student: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
