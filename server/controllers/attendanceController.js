import dbConfig from "../../db-connect.js";
import Attendance from "../models/attendanceModel.js";

const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find();
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { students_id, class_id, attendance_date, is_present } = req.body;
    const newAttendance = new Attendance({
      students_id,
      class_id,
      attendance_date,
      is_present,
    });
    await newAttendance.save();
    res.status(201).json({
      message: "Attendance created successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAttendanceById = async (req, res) => {
  try {
    // Extracting necessary data from request
    const { id } = req.params; // This 'id' should map to 'attendance_id' in your DB
    const { student_id, class_id, attendance_date, is_present } = req.body;

    // Constructing the SQL query
    const sql = `
      UPDATE Attendance
      SET student_id = ?, class_id = ?, attendance_date = ?, is_present = ?
      WHERE attendance_id = ?;
    `;

    // Executing the SQL query with the provided values
    const [results] = await dbConfig.execute(sql, [
      student_id || null, // Handling potential null values
      class_id || null,
      attendance_date || null,
      is_present !== undefined ? is_present : null,
      id,
    ]);

    // Checking if the update was successful
    if (results.affectedRows === 0) {
      // If no rows were affected, it means the attendance with the given ID was not found
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Sending the success response
    res.json({
      message: "Attendance updated successfully",
      attendance: {
        attendance_id: id,
        student_id,
        class_id,
        attendance_date,
        is_present,
      },
    });
  } catch (error) {
    // Handling any errors that occur during the update process
    console.error("Failed to update attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAttendance = await Attendance.getByIdAndDelete(id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json({
      message: "Attendance deleted successfully",
      attendance: deletedAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
};
