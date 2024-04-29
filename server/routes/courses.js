import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "../controllers/coursesController.js";

const coursesRouter = Router();

// Fetch all courses
coursesRouter.get("/", (req, res) => {
  dbConfig.query("SELECT * FROM Courses", (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Get a course by ID
coursesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "SELECT * FROM Courses WHERE course_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error fetching course by ID:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Course not found" });
      } else {
        res.json(result[0]);
      }
    }
  );
});

coursesRouter.post("/", (req, res) => {
  const { course_name } = req.body;
  if (!course_name) {
    return res.status(400).json({ error: "Course name is required" });
  }

  dbConfig.query(
    "INSERT INTO Courses (course_name) VALUES (?)",
    [course_name],
    (err, result) => {
      if (err) {
        console.error("Error adding course:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ id: result.insertId });
      }
    }
  );
});

// Update an existing course
coursesRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { course_name } = req.body;
  if (!course_name) {
    return res.status(400).json({ error: "Course name is required" });
  }

  dbConfig.query(
    "UPDATE Courses SET course_name = ? WHERE course_id = ?",
    [course_name, id],
    (err, result) => {
      if (err) {
        console.error("Error updating course:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Course not found" });
      } else {
        res.json({ success: true, message: "Course updated successfully" });
      }
    }
  );
});

// Delete a course
coursesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "DELETE FROM Courses WHERE course_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting course:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Course not found" });
      } else {
        res.json({ success: true, message: "Course deleted successfully" });
      }
    }
  );
});
export default coursesRouter;
