import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "../controllers/studentsController.js";

const studentsRouter = Router();

// Fetch all students
studentsRouter.get("/", (req, res) => {
  const { gender } = req.query;
  let queryString = "SELECT * FROM students";

  // Check if gender parameter is provided
  if (gender) {
    queryString += ` WHERE gender = '${gender}'`;
  }

  queryString += " ORDER BY firstname";

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

studentsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const queryString = `
      SELECT s.student_id, s.firstname, s.lastname, s.email, s.gender, s.number, c.course_name
      FROM Students s
      JOIN Courses c ON s.course_id = c.course_id
      WHERE s.student_id = ?;
    `;
    const [results] = await dbConfig.promise().query(queryString, [id]);
    if (results.length === 0) {
      res.status(404).json({ message: "Student not found" });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new student
studentsRouter.post("/", async (req, res) => {
  const { firstname, lastname, email, gender, number, course_name } = req.body; // Added course_name
  if (!firstname || !lastname || !email || !gender || !number || !course_name) {
    // Check for course_name
    return res
      .status(400)
      .json({ error: "All fields including course name are required." });
  }

  try {
    // Fetch the course_id based on course_name
    const courseQuery = "SELECT course_id FROM Courses WHERE course_name = ?";
    const [courseResults] = await dbConfig
      .promise()
      .query(courseQuery, [course_name]);

    if (courseResults.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    const course_id = courseResults[0].course_id;

    // Insert the new student record
    const insertStudentQuery =
      "INSERT INTO Students (firstname, lastname, email, gender, number, course_id) VALUES (?, ?, ?, ?, ?, ?)";
    await dbConfig
      .promise()
      .query(insertStudentQuery, [
        firstname,
        lastname,
        email,
        gender,
        number,
        course_id,
      ]);
    res.status(201).json({ message: "Student created successfully" });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing student
studentsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, gender, number, course_name } = req.body;

  if (!firstname || !lastname || !email || !gender || !number) {
    // Removed the course_name check for simplicity
    return res
      .status(400)
      .json({ error: "All fields are required and must be valid." });
  }

  try {
    let course_id = null;
    if (course_name) {
      const courseQuery = "SELECT course_id FROM Courses WHERE course_name = ?";
      const [courseResults] = await dbConfig
        .promise()
        .query(courseQuery, [course_name]);
      if (courseResults.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      course_id = courseResults[0].course_id;
    }

    const updateQuery =
      "UPDATE Students SET firstname = ?, lastname = ?, email = ?, gender = ?, number = ?, course_id = COALESCE(?, course_id) WHERE student_id = ?";
    await dbConfig
      .promise()
      .query(updateQuery, [
        firstname,
        lastname,
        email,
        gender,
        number,
        course_id,
        id,
      ]);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a student
studentsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteQuery = "DELETE FROM Students WHERE student_id = ?";
    const [result] = await dbConfig.promise().query(deleteQuery, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Student not found" });
    } else {
      res.json({ message: "Student deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default studentsRouter;
