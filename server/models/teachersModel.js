// models/Teachers.js

import dbConfig from "../../db-connect.js";

const Teacher = {
  getAll: (result) => {
    dbConfig.query("SELECT * FROM Teachers", (err, res) => {
      if (err) {
        console.error("Error while fetching teachers: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  },

  getById: (teacherId, result) => {
    dbConfig.query(
      "SELECT * FROM Teachers WHERE teacher_id = ?",
      [teacherId],
      (err, res) => {
        if (err) {
          console.error("Error fetching teacher: ", err);
          result(err, null);
          return;
        }
        if (res.length === 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, res[0]);
      }
    );
  },

  create: (newTeacher, result) => {
    dbConfig.query("INSERT INTO Teachers SET ?", newTeacher, (err, res) => {
      if (err) {
        console.error("Error while creating teacher: ", err);
        result(err, null);
        return;
      }
      console.log("Created teacher: ", { id: res.insertId, ...newTeacher });
      result(null, { id: res.insertId, ...newTeacher });
    });
  },

  updateById: (teacherId, teacher, result) => {
    dbConfig.query(
      "UPDATE Teachers SET ? WHERE teacher_id = ?",
      [teacher, teacherId],
      (err, res) => {
        if (err) {
          console.error("Error updating teacher: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows === 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, { id: teacherId, ...teacher });
      }
    );
  },

  deleteById: (teacherId, result) => {
    dbConfig.query(
      "DELETE FROM Teachers WHERE teacher_id = ?",
      [teacherId],
      (err, res) => {
        if (err) {
          console.error("Error deleting teacher: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows === 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, res);
      }
    );
  },
};

export default Teacher;
