import dbConfig from "./../../db-connect.js";
import bcrypt from "bcrypt";

const authModel = {
  findUserByEmail: async (email) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    return new Promise((resolve, reject) => {
      dbConfig.query(sql, [email], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  createUser: async (username, password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const insertQuery =
      "INSERT INTO Users (username, passwordHash) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
      dbConfig.query(insertQuery, [username, passwordHash], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
};

export default authModel;
