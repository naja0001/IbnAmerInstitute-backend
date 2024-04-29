// models/student.js

import dbConfig from "../../db-connect.js";

const Student = {
  getAll: (callback) => {
    const queryString = `
      SELECT s.student_id, s.firstname, s.lastname, s.email, s.gender, s.number, c.course_name
      FROM Students s
      JOIN Courses c ON s.course_id = c.course_id
      ORDER BY s.firstname;
    `;
    dbConfig.query(queryString, (error, results) => {
      if (error) {
        console.error(error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  getById: (id, callback) => {
    const queryString = `
      SELECT s.student_id, s.firstname, s.lastname, s.email, s.gender, s.number, c.course_name
      FROM Students s
      JOIN Courses c ON s.course_id = c.course_id
      WHERE s.student_id = ?;
    `;
    dbConfig.query(queryString, [id], (error, results) => {
      if (error) {
        console.error(error);
        return callback(error, null);
      }
      if (results.length === 0) {
        return callback({ message: "Student not found" }, null);
      }
      return callback(null, results[0]);
    });
  },

  // Adjusting create method to include course_id
  create: (firstname, lastname, email, gender, number, course_id, callback) => {
    const queryString =
      "INSERT INTO Students (firstname, lastname, email, gender, number, course_id) VALUES (?, ?, ?, ?, ?, ?)";
    dbConfig.query(
      queryString,
      [firstname, lastname, email, gender, number, course_id],
      (error, results) => {
        if (error) {
          console.error(error);
          return callback(error, null);
        }
        return callback(null, {
          message: "Student created successfully",
          student_id: results.insertId,
        });
      }
    );
  },

  // Updating the updateById method to accommodate changes
  updateById: (
    student_id,
    firstname,
    lastname,
    email,
    gender,
    number,
    course_id,
    callback
  ) => {
    const queryString =
      "UPDATE Students SET firstname = ?, lastname = ?, email = ?, gender = ?, number = ?, course_id = ? WHERE student_id = ?";
    dbConfig.query(
      queryString,
      [firstname, lastname, email, gender, number, course_id, student_id],
      (error, results) => {
        if (error) {
          console.error(error);
          return callback(error, null);
        }
        if (results.affectedRows === 0) {
          return callback({ message: "Student not found" }, null);
        }
        return callback(null, { message: "Student updated successfully" });
      }
    );
  },

  // Keeping the deleteById method
  deleteById: (student_id, callback) => {
    const queryString = "DELETE FROM Students WHERE student_id = ?";
    dbConfig.query(queryString, [student_id], (error, results) => {
      if (error) {
        console.error(error);
        return callback(error, null);
      }
      if (results.affectedRows === 0) {
        return callback({ message: "Student not found" }, null);
      }
      return callback(null, { message: "Student deleted successfully" });
    });
  },
};

export default Student;
