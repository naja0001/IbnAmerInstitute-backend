// controllers/teacherController.js
import Teacher from "../models/teachersModel.js";

const getAllTeachers = (req, res) => {
  Teacher.getAll((err, teachers) => {
    if (err) {
      console.error("Failed to retrieve all teachers:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(teachers);
  });
};

const getTeacherById = (req, res) => {
  const { id } = req.params;
  Teacher.getById(id, (err, teacher) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ message: "Teacher not found" });
      } else {
        console.error("Failed to retrieve teacher:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    res.json(teacher);
  });
};

const createTeacher = (req, res) => {
  const { firstname, lastname, email, number, title } = req.body;

  const newTeacher = { firstname, lastname, email, number, title };

  Teacher.create(newTeacher, (err, teacher) => {
    if (err) {
      console.error("Error creating teacher:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json(teacher);
  });
};

const updateTeacherById = (req, res) => {
  const { id } = req.params;
  const teacherUpdates = req.body;

  Teacher.updateById(id, teacherUpdates, (err, result) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ message: "Teacher not found" });
      } else {
        console.error("Error updating teacher:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    res.json({ message: "Teacher updated successfully" });
  });
};

const deleteTeacherById = (req, res) => {
  const { id } = req.params;
  Teacher.deleteById(id, (err, result) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ message: "Teacher not found" });
      } else {
        console.error("Error deleting teacher:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    res.json({ message: "Teacher deleted successfully" });
  });
};

export {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherById,
  deleteTeacherById,
};
