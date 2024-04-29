import { Router } from "express";
import dbConfig from "../../db-connect.js";

const studentClassesRouter = Router();

// Fetch all enrollments
studentClassesRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Student_Classes;";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching all enrollments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Fetch all class enrollments for a student
studentClassesRouter.get("/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const queryString =
    "SELECT class_id FROM Student_Classes WHERE student_id = ?;";
  dbConfig.query(queryString, [studentId], (error, results) => {
    if (error) {
      console.error("Error fetching class enrollments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

studentClassesRouter.get("/class/:classId", async (req, res) => {
  const classId = req.params.classId;
  try {
    const queryString =
      "SELECT s.* FROM Students s JOIN Student_Classes sc ON s.student_id = sc.student_id WHERE sc.class_id = ?";
    const [results] = await dbConfig.promise().query(queryString, [classId]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this class" });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Enroll a student in a new class
studentClassesRouter.post("/", async (req, res) => {
  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    return res
      .status(400)
      .json({ error: "Both studentId and classId are required." });
  }

  try {
    // Check if both student and class exist
    const existsQuery =
      "SELECT EXISTS(SELECT 1 FROM Students WHERE student_id = ?) AS studentExists, EXISTS(SELECT 1 FROM Classes WHERE class_id = ?) AS classExists;";
    const [existsResult] = await dbConfig
      .promise()
      .query(existsQuery, [studentId, classId]);

    if (!existsResult[0].studentExists || !existsResult[0].classExists) {
      return res.status(404).json({ error: "Student or class not found." });
    }

    // Insert the relationship
    const insertQuery =
      "INSERT INTO Student_Classes (student_id, class_id) VALUES (?, ?);";
    await dbConfig.promise().query(insertQuery, [studentId, classId]);
    res.status(201).json({ message: "Enrollment successful" });
  } catch (error) {
    console.error("Error enrolling student in class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a student's class enrollment
studentClassesRouter.put("/:id", async (req, res) => {
  const { studentId, oldClassId, newClassId } = req.body;

  if (!studentId || !oldClassId || !newClassId) {
    return res.status(400).json({
      error: "Student ID, old class ID, and new class ID are required.",
    });
  }

  try {
    // Check if the new class exists
    const classExistsQuery =
      "SELECT EXISTS(SELECT 1 FROM Classes WHERE class_id = ?) AS classExists;";
    const [classExistsResult] = await dbConfig
      .promise()
      .query(classExistsQuery, [newClassId]);

    if (!classExistsResult[0].classExists) {
      return res.status(404).json({ error: "New class not found." });
    }

    // Update the enrollment
    const updateQuery =
      "UPDATE Student_Classes SET class_id = ? WHERE student_id = ? AND class_id = ?;";
    const result = await dbConfig
      .promise()
      .query(updateQuery, [newClassId, studentId, oldClassId]);

    if (result[0].affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Enrollment not found or unchanged." });
    }

    res.json({ message: "Enrollment updated successfully" });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a student's class enrollment
studentClassesRouter.delete("/:id", async (req, res) => {
  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    return res
      .status(400)
      .json({ error: "Student ID and class ID are required." });
  }

  try {
    const deleteQuery =
      "DELETE FROM Student_Classes WHERE student_id = ? AND class_id = ?;";
    const result = await dbConfig
      .promise()
      .query(deleteQuery, [studentId, classId]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default studentClassesRouter;
