// models/QuranProgress.js
import dbConfig from "../../db-connect.js";

const QuranProgress = {
  getAll: (result) => {
    dbConfig.query("SELECT * FROM QuranProgress", (err, res) => {
      if (err) {
        console.error("Error while fetching Quran progress: ", err);
        result(err, null);
        return;
      }
      console.log("Quran progress: ", res);
      result(null, res);
    });
  },

  getById: (progressId, result) => {
    dbConfig.query(
      "SELECT * FROM QuranProgress WHERE id = ?",
      progressId,
      (err, res) => {
        if (err) {
          console.error("Error while fetching Quran progress: ", err);
          result(err, null);
          return;
        }
        if (res.length) {
          console.log("Found Quran progress: ", res[0]);
          result(null, res[0]);
          return;
        }
        // Quran progress with the specified id not found
        result({ kind: "not_found" }, null);
      }
    );
  },

  create: (newProgress, result) => {
    dbConfig.query(
      "INSERT INTO QuranProgress SET ?",
      newProgress,
      (err, res) => {
        if (err) {
          console.error("Error while creating Quran progress: ", err);
          result(err, null);
          return;
        }
        console.log("Created Quran progress: ", {
          id: res.insertId,
          ...newProgress,
        });
        result(null, { id: res.insertId, ...newProgress });
      }
    );
  },

  updateById: (progressId, progress, result) => {
    dbConfig.query(
      "UPDATE QuranProgress SET studentId = ?, surah = ?, verse = ? WHERE id = ?",
      [progress.studentId, progress.surah, progress.verse, progressId],
      (err, res) => {
        if (err) {
          console.error("Error while updating Quran progress: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Quran progress with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Updated Quran progress with id: ", progressId);
        result(null, res);
      }
    );
  },

  deleteById: (progressId, result) => {
    dbConfig.query(
      "DELETE FROM QuranProgress WHERE id = ?",
      progressId,
      (err, res) => {
        if (err) {
          console.error("Error while deleting Quran progress: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Quran progress with the specified id not found
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Deleted Quran progress with id: ", progressId);
        result(null, res);
      }
    );
  },
};

export default QuranProgress;
