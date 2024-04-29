import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

const classesRouter = Router();

// Fetch all classes
// Fetch all classes
classesRouter.get("/", (req, res) => {
  dbConfig.query("SELECT * FROM Classes", (err, results) => {
    if (err) {
      console.error("Error fetching classes:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Get a class by ID
classesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "SELECT * FROM Classes WHERE class_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error fetching class by ID:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json(result[0]);
      }
    }
  );
});

// Add a new class
classesRouter.post("/", (req, res) => {
  const { courseName, teacherName, email, duration } = req.body;

  // Check if courseName, teacherName, email, and duration are provided
  if (!courseName || !teacherName || !email || !duration) {
    return res.status(400).json({
      error: "Course name, teacher name, email, and duration are required",
    });
  }

  // Split teacherName into firstname and lastname
  const [firstname, lastname] = teacherName.split(" ");

  // Retrieve or create the teacher
  dbConfig.query(
    "SELECT teacher_id FROM Teachers WHERE CONCAT(firstname, ' ', lastname) = ?",
    [teacherName],
    (teacherErr, teacherResult) => {
      if (teacherErr) {
        console.error("Error fetching teacher ID:", teacherErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      let teacher_id;
      if (teacherResult.length === 0) {
        // If the teacher doesn't exist, create it
        dbConfig.query(
          "INSERT INTO Teachers (firstname, lastname, email) VALUES (?, ?, ?)",
          [firstname, lastname, email],
          (insertTeacherErr, insertTeacherResult) => {
            if (insertTeacherErr) {
              console.error("Error adding teacher:", insertTeacherErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            teacher_id = insertTeacherResult.insertId;
            retrieveOrInsertCourse();
          }
        );
      } else {
        teacher_id = teacherResult[0].teacher_id;
        retrieveOrInsertCourse();
      }

      // Function to retrieve or insert the course
      function retrieveOrInsertCourse() {
        dbConfig.query(
          "SELECT course_id FROM Courses WHERE course_name = ?",
          [courseName],
          (courseErr, courseResult) => {
            if (courseErr) {
              console.error("Error fetching course ID:", courseErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            let course_id;
            if (courseResult.length === 0) {
              // If the course doesn't exist, create it
              dbConfig.query(
                "INSERT INTO Courses (course_name) VALUES (?)",
                [courseName],
                (insertCourseErr, insertCourseResult) => {
                  if (insertCourseErr) {
                    console.error("Error adding course:", insertCourseErr);
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }
                  course_id = insertCourseResult.insertId;
                  insertClass(course_id);
                }
              );
            } else {
              course_id = courseResult[0].course_id;
              insertClass(course_id);
            }

            // Function to insert the class
            function insertClass(course_id) {
              dbConfig.query(
                "INSERT INTO Classes (course_id, teacher_id, duration) VALUES (?, ?, ?)",
                [course_id, teacher_id, duration],
                (insertClassErr, result) => {
                  if (insertClassErr) {
                    console.error("Error adding class:", insertClassErr);
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }
                  // Send response with class information
                  res.status(201).json({
                    class_id: result.insertId,
                    course_id,
                    course_name: courseName,
                    teacher_id,
                    teacher_name: teacherName,
                    email,
                    duration,
                  });
                }
              );
            }
          }
        );
      }
    }
  );
});

// Update an existing class
classesRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { course_id, teacher_id, duration } = req.body;
  if (!course_id || !teacher_id || !duration) {
    return res
      .status(400)
      .json({ error: "Course ID, teacher ID, and duration are required" });
  }

  dbConfig.query(
    "UPDATE Classes SET course_id = ?, teacher_id = ?, duration = ? WHERE class_id = ?",
    [course_id, teacher_id, duration, id],
    (err, result) => {
      if (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json({ success: true, message: "Class updated successfully" });
      }
    }
  );
});

// Delete a class
classesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "DELETE FROM Classes WHERE class_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json({ success: true, message: "Class deleted successfully" });
      }
    }
  );
});
export default classesRouter;
