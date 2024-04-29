import dbConfig from "../../db-connect.js";

const Attendance = {
  getAll: (result) => {
    dbConfig.query("SELECT * FROM Attendance", (err, res) => {
      if (err) {
        console.error("Error while fetching attendance: ", err);
        result(err, null);
        return;
      }
      console.log("Attendance: ", res);
      result(null, res);
    });
  },

  getById: (attendanceId, result) => {
    dbConfig.query(
      "SELECT * FROM Attendance WHERE id = ?",
      attendanceId,
      (err, res) => {
        if (err) {
          console.error("Error while fetching attendance: ", err);
          result(err, null);
          return;
        }
        if (res.length) {
          console.log("Found attendance: ", res[0]);
          result(null, res[0]);
          return;
        }
        // Attendance with the specified id not found
        result({ kind: "not_found" }, null);
      }
    );
  },

  create: (newAttendance, result) => {
    dbConfig.query(
      "INSERT INTO Attendance SET ?",
      newAttendance,
      (err, res) => {
        if (err) {
          console.error("Error while creating attendance: ", err);
          result(err, null);
          return;
        }
        console.log("Created attendance: ", {
          id: res.insertId,
          ...newAttendance,
        });
        result(null, { id: res.insertId, ...newAttendance });
      }
    );
  },

  updateById: (attendanceId, attendance, result) => {
    dbConfig.query(
      "UPDATE Attendance SET studentId = ?, date = ?, status = ? WHERE id = ?",
      [attendance.studentId, attendance.date, attendance.status, attendanceId],
      (err, res) => {
        if (err) {
          console.error("Error while updating attendance: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Attendance with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Updated attendance with id: ", attendanceId);
        result(null, res);
      }
    );
  },

  deleteById: (attendanceId, result) => {
    dbConfig.query(
      "DELETE FROM Attendance WHERE id = ?",
      attendanceId,
      (err, res) => {
        if (err) {
          console.error("Error while deleting attendance: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Attendance with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Deleted attendance with id: ", attendanceId);
        result(null, res);
      }
    );
  },
};

export default Attendance;
