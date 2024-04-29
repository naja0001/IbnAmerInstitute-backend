import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

const homeworkRouter = Router();

// Fetch all homework assignments
homeworkRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Homework";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching homework assignments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific homework assignment by ID
homeworkRouter.get("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const queryString = "SELECT * FROM Homework WHERE homework_id = ?";
  dbConfig.query(queryString, [homeworkId], (error, results) => {
    if (error) {
      console.error("Error fetching homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json(results[0]); // Return the first and only homework assignment in the array
    }
  });
});

// Fetch the history for a specific homework assignment
homeworkRouter.get("/:id/history", (req, res) => {
  const homeworkId = req.params.id;
  const queryString =
    "SELECT * FROM HomeworkHistory WHERE homework_id = ? ORDER BY updated_at DESC";

  dbConfig.query(queryString, [homeworkId], (error, results) => {
    if (error) {
      console.error("Error fetching homework history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results); // Return the history array
    }
  });
});

homeworkRouter.post("/", (req, res) => {
  const { studentId, courseId } = req.params;
  const {
    assignment_name,
    description,
    due_date,
    is_completed,
    completion_date,
  } = req.body;

  // Basic validation to ensure required fields are present
  if (!assignment_name || !description || !due_date) {
    return res.status(400).json({
      error: "Assignment name, description, and due date are required.",
    });
  }

  // Convert is_completed to a boolean value if it's not already
  const isCompletedBoolean = is_completed === true || is_completed === "true";

  // Insert the homework entry now that we have student_id and course_id from URL
  const insertQuery = `
        INSERT INTO Homework
        (course_id, student_id, assignment_name, description, due_date, is_completed, completion_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  dbConfig.query(
    insertQuery,
    [
      courseId,
      studentId,
      assignment_name,
      description,
      due_date,
      isCompletedBoolean,
      completion_date,
    ],
    (error, results) => {
      if (error) {
        console.error("Failed to insert homework data:", error);
        return res.status(500).json({
          error: "Database error during the insertion of homework data",
        });
      }
      res.status(201).json({
        message: "Homework recorded successfully",
        homework_id: results.insertId,
      });
    }
  );
});

// Update an existing homework assignment
homeworkRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const homeworkToUpdate = req.body;
  const selectQuery = "SELECT * FROM Homework WHERE homework_id = ?";

  // Get the current homework record
  dbConfig.query(selectQuery, [id], (error, results) => {
    if (error) {
      console.error("Error fetching homework for history:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length > 0) {
      // Insert current homework into HomeworkHistory before updating
      const insertHistoryQuery = "INSERT INTO HomeworkHistory SET ?";
      dbConfig.query(insertHistoryQuery, results[0], (error, results) => {
        if (error) {
          console.error("Error saving homework history:", error);
          return res
            .status(500)
            .json({ error: "Error saving homework history" });
        }

        const updateQuery = "UPDATE Homework SET ? WHERE homework_id = ?";
        dbConfig.query(
          updateQuery,
          [homeworkToUpdate, id],
          (error, results) => {
            if (error) {
              console.error("Error updating homework:", error);
              return res.status(500).json({ error: "Error updating homework" });
            }
            return res.json({
              message: "Homework updated successfully",
              historyId: results.insertId,
            });
          }
        );
      });
    } else {
      res.status(404).json({ message: "Homework assignment not found" });
    }
  });
});

// Delete a homework assignment
homeworkRouter.delete("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const deleteQuery = "DELETE FROM Homework WHERE homework_id = ?";
  dbConfig.query(deleteQuery, [homeworkId], (error, result) => {
    if (error) {
      console.error("Error deleting homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json({ message: "Homework assignment deleted successfully" });
    }
  });
});

export default homeworkRouter;
