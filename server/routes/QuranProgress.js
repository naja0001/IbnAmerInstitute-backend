import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

const QuranProgressRouter = Router();

QuranProgressRouter.get("/", (req, res) => {
  const queryString = `
    SELECT * FROM QuranProgress
    ORDER BY student_id, completion_date DESC;
  `; // Corrected 'students_id' to 'student_id'

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching Quran progress" });
    } else {
      const formattedResults = results.map((progress) => ({
        ...progress,
        is_completed: !!progress.is_completed, // Converts 0/1 to boolean
      }));
      res.json(formattedResults);
    }
  });
});

QuranProgressRouter.get("/:id", (req, res) => {
  const studentId = req.params.id;

  const queryString = `
    SELECT * FROM QuranProgress
    WHERE student_id = ?
    ORDER BY completion_date DESC;
  `;

  const values = [studentId];

  dbConfig.query(queryString, values, (error, results) => {
    if (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching Quran progress" });
    } else {
      const formattedResults = results.map((progress) => ({
        ...progress,
        is_completed: !!progress.is_completed, // Converts 0/1 to boolean
      }));
      res.json(formattedResults);
    }
  });
});

// Quran Progress Creation Route
// POST endpoint to create a new Quran progress record
QuranProgressRouter.post("/", (req, res) => {
  const { firstname, chapter_number, is_completed, completion_date, grade } =
    req.body;

  // Check if all required fields are provided
  if (
    !firstname ||
    !chapter_number ||
    !is_completed ||
    !completion_date ||
    !grade
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required for creating Quran progress" });
  }

  // Attempt to find the student by firstname
  dbConfig.query(
    "SELECT student_id FROM Students WHERE firstname = ?",
    [firstname],
    (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching student ID" });
      }

      let student_id;

      if (results.length === 0) {
        // If the student doesn't exist, create a new student
        dbConfig.query(
          "INSERT INTO Students (firstname) VALUES (?)",
          [firstname],
          (error, result) => {
            if (error) {
              console.error(error);
              return res
                .status(500)
                .json({ error: "An error occurred while creating student" });
            }
            // Get the newly created student's ID
            student_id = result.insertId;
            createQuranProgress(
              student_id,
              chapter_number,
              is_completed,
              completion_date,
              grade,
              res
            );
          }
        );
      } else {
        // If the student exists, use their ID to create the Quran progress entry
        student_id = results[0].student_id;
        createQuranProgress(
          student_id,
          chapter_number,
          is_completed,
          completion_date,
          grade,
          res
        );
      }
    }
  );
});

// Function to create Quran progress entry
function createQuranProgress(
  student_id,
  chapter_number,
  is_completed,
  completion_date,
  grade,
  res
) {
  const isCompletedValue = is_completed ? 1 : 0;
  const insertQuery =
    "INSERT INTO QuranProgress (student_id, chapter_number, is_completed, completion_date, grade) VALUES (?, ?, ?, ?, ?)";
  const values = [
    student_id,
    chapter_number,
    isCompletedValue,
    completion_date,
    grade,
  ];

  dbConfig.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error("Error inserting Quran progress:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating Quran progress" });
    }
    res.status(201).json({
      message: "Quran progress created successfully",
      progress_id: results.insertId,
    });
  });
}

QuranProgressRouter.put("/:progressId", (req, res) => {
  const { progressId } = req.params;
  const { student_id, chapter_number, is_completed, completion_date, grade } =
    req.body;

  // Validating input before updating
  if (!student_id || !chapter_number || !completion_date || !grade) {
    return res
      .status(400)
      .json({ error: "All fields are required for update." });
  }

  const isCompletedValue = is_completed ? 1 : 0;
  const updateQuery = `
    UPDATE QuranProgress
    SET student_id = ?, chapter_number = ?, is_completed = ?, completion_date = ?, grade = ?
    WHERE progress_id = ?
  `;

  dbConfig.query(
    updateQuery,
    [
      student_id,
      chapter_number,
      isCompletedValue,
      completion_date,
      grade,
      progressId,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating Quran progress:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Quran progress not found" });
      } else {
        res.json({ message: "Quran progress updated successfully" });
      }
    }
  );
});

QuranProgressRouter.delete("/:progressId", (req, res) => {
  const { progressId } = req.params;

  const deleteQuery = "DELETE FROM QuranProgress WHERE progress_id = ?";
  dbConfig.query(deleteQuery, [progressId], (error, result) => {
    if (error) {
      console.error("Error deleting Quran progress:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Quran progress not found" });
    } else {
      res.json({ message: "Quran progress deleted successfully" });
    }
  });
});

export default QuranProgressRouter;
