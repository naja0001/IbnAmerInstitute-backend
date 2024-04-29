// models/Homework.js
import dbConfig from "../../db-connect.js";

const Homework = {
  getAll: (result) => {
    dbConfig.query("SELECT * FROM Homework", (err, res) => {
      if (err) {
        console.error("Error while fetching homework: ", err);
        result(err, null);
        return;
      }
      console.log("Homework: ", res);
      result(null, res);
    });
  },

  getById: (homeworkId, result) => {
    dbConfig.query(
      "SELECT * FROM Homework WHERE id = ?",
      homeworkId,
      (err, res) => {
        if (err) {
          console.error("Error while fetching homework: ", err);
          result(err, null);
          return;
        }
        if (res.length) {
          console.log("Found homework: ", res[0]);
          result(null, res[0]);
          return;
        }
        // Homework with the specified id not found
        result({ kind: "not_found" }, null);
      }
    );
  },

  create: (newHomework, result) => {
    dbConfig.query("INSERT INTO Homework SET ?", newHomework, (err, res) => {
      if (err) {
        console.error("Error while creating homework: ", err);
        result(err, null);
        return;
      }
      console.log("Created homework: ", { id: res.insertId, ...newHomework });
      result(null, { id: res.insertId, ...newHomework });
    });
  },

  updateById: (homeworkId, homework, result) => {
    dbConfig.query(
      "UPDATE Homework SET subject = ?, description = ?, dueDate = ? WHERE id = ?",
      [homework.subject, homework.description, homework.dueDate, homeworkId],
      (err, res) => {
        if (err) {
          console.error("Error while updating homework: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Homework with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Updated homework with id: ", homeworkId);
        result(null, res);
      }
    );
  },

  deleteById: (homeworkId, result) => {
    dbConfig.query(
      "DELETE FROM Homework WHERE id = ?",
      homeworkId,
      (err, res) => {
        if (err) {
          console.error("Error while deleting homework: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Homework with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Deleted homework with id: ", homeworkId);
        result(null, res);
      }
    );
  },
};

export default Homework;
