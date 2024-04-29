import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherById,
  deleteTeacherById,
} from "../controllers/teachersController.js";

const teachersRouter = Router();

// Fetch all teachers
teachersRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Teachers ORDER BY firstname;";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching teachers:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching teachers" });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific teacher by ID
teachersRouter.get("/:id", (req, res) => {
  const teacherId = req.params.id;
  const queryString = "SELECT * FROM Teachers WHERE teacher_id = ?";

  dbConfig.query(queryString, [teacherId], (error, results) => {
    if (error) {
      console.error("Error fetching teacher:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Teacher not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new teacher
// Create a new teacher
teachersRouter.post("/", async (req, res) => {
  const { firstname, lastname, email, number, title } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !title ||
    isNaN(parseFloat(number))
  ) {
    return res.status(400).json({
      error: "All fields, including title, are required and must be valid.",
    });
  }

  try {
    const insertTeacherQuery =
      "INSERT INTO Teachers (firstname, lastname, email, number, title) VALUES (?, ?, ?, ?, ?)";
    await dbConfig
      .promise()
      .query(insertTeacherQuery, [firstname, lastname, email, number, title]);
    res.status(201).json({ message: "Teacher created successfully" });
  } catch (error) {
    console.error("Error in creating teacher:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Update an existing teacher
teachersRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, number, title } = req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !title ||
    isNaN(parseFloat(number))
  ) {
    return res.status(400).json({
      error: "All fields, including title, are required and must be valid.",
    });
  }

  const updateQuery =
    "UPDATE Teachers SET firstname = ?, lastname = ?, email = ?, number = ?, title = ? WHERE teacher_id = ?";
  dbConfig.query(
    updateQuery,
    [firstname, lastname, email, number, title, id],
    (err, result) => {
      if (err) {
        console.error("Error updating teacher:", err);
        return res.status(500).json({
          error: "An error occurred while updating the teacher",
          details: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json({ message: "Teacher updated successfully" });
    }
  );
});

// Delete a teacher
teachersRouter.delete("/:id", (req, res) => {
  const teacherId = req.params.id;
  const deleteQuery = "DELETE FROM Teachers WHERE teacher_id = ?";
  dbConfig.query(deleteQuery, [teacherId], (err, result) => {
    if (err) {
      console.error("Error deleting teacher:", err);
      return res.status(500).json({ error: "Failed to delete teacher" });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    } else {
      return res.json({ message: "Teacher deleted successfully" });
    }
  });
});

export default teachersRouter;
