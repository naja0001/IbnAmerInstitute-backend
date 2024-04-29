import Student from "../models/studentsModel.js";

const getAllStudents = async (req, res) => {
  try {
    Student.getAll((error, students) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(students);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    Student.getById(id, (error, student) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createStudent = async (req, res) => {
  try {
    const { firstname, lastname, email, gender, number, course_id } = req.body;
    Student.create(
      firstname,
      lastname,
      email,
      gender,
      number,
      course_id,
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({
          message: "Student created successfully",
          studentId: result.student_id,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, gender, number, course_id } = req.body;
    Student.updateById(
      id,
      firstname,
      lastname,
      email,
      gender,
      number,
      course_id,
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!result) {
          return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student updated successfully", student: result });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    Student.deleteById(id, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!result) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: "Student deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
};
